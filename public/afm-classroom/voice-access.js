/* Shared browser and optional server-side Gemini reading with explicit microphone access. */
(() => {
  'use strict';
  if (window.__afmVoiceAccess) return;
  window.__afmVoiceAccess = true;
  const start = () => {
    const doc = document, synth = window.speechSynthesis;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const canRead = !!(synth && window.SpeechSynthesisUtterance);
    let bus = window; try { if (window.top.location.origin === location.origin) bus = window.top; } catch (_) {}
    const owner = Math.random().toString(36).slice(2), KEY = 'afm-reading-preferences-v1';
    let prefs = {rate:1,voice:''}; try { prefs = {...prefs,...JSON.parse(localStorage.getItem(KEY)||'{}')}; } catch (_) {}
    let reading = false, paused = false, token = 0, lastText = '', lastLabel = '', activeElement = null;
    let savedRange=null;
    let cloudReady=false, cloudVoices=[], audio=null, audioUrl='', cloudAbort=null; const audioCache=new Map();
    let rec = null, listening = false, micToken = 0, lockedTarget = null, selection = '', lastTarget = null;
    const controls = new Map(), targets = new Map(); let targetCounter = 0, scheduled = false;
    const ui = doc.createElement('aside'); ui.className = 'va-ui'; ui.setAttribute('aria-label','Voice and reading controls');
    ui.innerHTML = `<div class="va-launch"><button type="button" data-va="toggle" aria-expanded="false">Voice & reading</button><button type="button" data-va="stop-all">Stop all</button><span data-va="short" aria-live="polite">Ready</span></div>
      <div class="va-panel" hidden><h2>Listen and speak</h2><p class="va-note">Choose a browser voice or a natural Google voice. Google reading sends the chosen text to Google to generate audio. Voice commands and dictation use your browser.</p>
      <div class="va-actions"><button type="button" data-va="page">Read page</button><button type="button" data-va="selection">Read selected text</button><button type="button" data-va="pause">Pause</button><button type="button" data-va="resume">Resume</button><button type="button" data-va="repeat">Read again</button><button type="button" data-va="preview">Preview voice</button></div>
      <label>Reading speed<select data-va="rate"><option value="0.75">0.75×</option><option value="0.9">0.9×</option><option value="1">1×</option><option value="1.15">1.15×</option><option value="1.3">1.3×</option><option value="1.5">1.5×</option></select></label>
      <label>Reading voice<select data-va="voice"><option value="">Browser default</option></select></label>
      <label>Microphone mode<select data-va="mode"><option value="commands">Commands</option><option value="dictation">Dictation into a field</option></select></label>
      <label>Dictation field<select data-va="target"><option value="">Choose an answer or text field</option></select></label>
      <div class="va-actions"><button type="button" data-va="read-field">Read chosen field</button><button type="button" data-va="mic">Start microphone</button><button type="button" data-va="mic-stop">Stop microphone</button></div>
      <p class="va-note">The microphone starts only when you press Start microphone. Your browser may send speech to its recognition service. Dictation inserts final words into the chosen field; commands never become answers. Reading turns the microphone off. Starting Commands pauses this reader; say “resume reading” to continue with the microphone off.</p>
      <p data-va="status" role="status">Ready. Use a Read button beside a text block, or select text first.</p><p data-va="heard" aria-live="polite"></p>
      <details><summary>Voice commands and keyboard help</summary><p>In Commands mode say: “read page”, “read selection”, “read lesson”, “read full question”, “read requirements”, “read exhibits”, “read exhibit 2”, “read hints”, “pause reading”, “resume reading”, “stop reading”.</p><p>Study actions: “next lesson”, “previous lesson”, “open library”, “open question studio”, “open study plan”, “open method sheets”, “open voice companion”, “next gap”, “start timer”, “pause timer”, “reset timer”, “save attempt”, “show hint”, “show checkpoint”. Existing attempt gates still apply.</p><p>Site navigation: “open home”, “open Classroom”, “open Classroom 14”, “open training”, “open papers”, “open progress”, “open matchday”, “open Ke Finesse”. Navigation stops the microphone and reading.</p><p>Dictation mode writes what you say, including words that sound like commands. Choose the field before starting. Use Stop microphone to finish. Escape stops reading and the microphone. All controls also work with Tab and Enter. Selected-text reading covers labels and other text without its own Read button.</p><p>If speech is unavailable or permission is refused, keep using the regular keyboard, text fields and study controls. No microphone recording is saved by this feature; dictated text uses the existing page’s save behavior.</p></details></div>`;
    doc.body.append(ui);
    const $ = name => ui.querySelector(`[data-va="${name}"]`);
    function status(message) { $('status').textContent = message; $('short').textContent = listening ? 'Mic on' : paused ? 'Paused' : reading ? 'Reading' : 'Ready'; }
    function expand() { $('toggle').setAttribute('aria-expanded','true'); ui.querySelector('.va-panel').hidden=false; }
    function exclusive(kind) { bus.dispatchEvent(new CustomEvent('afm-voice-exclusive',{detail:{owner,kind}})); }
    function visible(el) {
      if (!el || !el.isConnected || el.closest('[hidden],[aria-hidden="true"],.va-ui,.va-read')) return false;
      for(let p=el;p;p=p.parentElement) {
        if(p.tagName==='DETAILS'&&!p.open && !p.querySelector('summary')?.contains(el)) return false;
      }
      const style=getComputedStyle(el); return !!el.getClientRects().length && style.visibility!=='hidden' && style.display!=='none';
    }
    function tableText(table) {
      const rows=[...table.rows];if(!rows.length)return '';
      const hasHeaders=rows[0].querySelector('th');
      const headings=hasHeaders?[...rows.shift().cells].map(c=>c.innerText||c.textContent):[];
      return 'Table. '+rows.map((row,i)=>'Row '+(i+1)+'. '+[...row.cells].map((cell,j)=>(headings[j]?.trim()||'Column '+(j+1))+': '+(cell.innerText||cell.textContent).trim()).join('; ')+'.').join(' ');
    }
    function textOf(el, source=false) {
      if(!el) return '';
      const walk=doc.createTreeWalker(el,NodeFilter.SHOW_TEXT); const parts=[]; const tables=new Set();
      while(walk.nextNode()) {
        const n=walk.currentNode,p=n.parentElement;
        if(!p || p.closest('script,style,noscript,button,input,textarea,select,.va-ui,.va-read,[role="button"]') || (!source&&!visible(p))) continue;
        const table=p.closest('table');if(table){if(!tables.has(table)){tables.add(table);parts.push(tableText(table));}continue;}
        if(n.textContent.trim()) parts.push(n.textContent.trim());
      }
      return parts.join(' ').replace(/\s+/g,' ').trim();
    }
    function stopRead(message) {
      cloudAbort?.abort();cloudAbort=null;if(audio){audio.pause();audio.src='';audio=null;}if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl='';}
      const owned=reading;token++; reading=false;paused=false; if(canRead&&owned) synth.cancel();
      activeElement?.classList.remove('va-reading');activeElement=null;
      $('pause').disabled=true;$('resume').disabled=true;
      if(message)status(message);
    }
    function stopMic(message) {
      micToken++;listening=false;const previous=rec;rec=null;
      if(previous){previous.onend=null;previous.onresult=null;try{previous.abort();}catch(_){}}
      lockedTarget=null;$('mic').disabled=!SR;$('mic-stop').disabled=true;
      if(message)status(message);
    }
    function stopAll(message='Reading and microphone stopped.') { stopMic();stopRead();status(message); }
    function speakText(text,label='text',el=null) {
      if(!canRead){status('Read-aloud is unavailable in this browser. You can still use the text.');return;}
      if(!text.trim()){status('There is no visible text to read here. Open the section first.');return;}
      stopMic();exclusive('speech');stopRead();lastText=text;lastLabel=label;activeElement=el;
      activeElement?.classList.add('va-reading');reading=true;expand();status(`Reading ${label}. Microphone is off.`);
      $('pause').disabled=false;$('resume').disabled=true;$('repeat').disabled=false;
      if(prefs.voice.startsWith('google:')&&cloudReady){cloudSpeak(text,label,++token);return;}
      // Bound utterance length without dropping trailing sentences or long paragraphs.
      const chunks=text.match(/[\s\S]{1,260}(?:\s|$)|[\s\S]{1,260}/g)||[text];
      const run=++token; let i=0;
      function next(){
        if(run!==token)return;
        if(i===chunks.length){reading=false;paused=false;activeElement?.classList.remove('va-reading');activeElement=null;$('pause').disabled=true;$('resume').disabled=true;status(`Finished ${label}. Microphone remains off.`);return;}
        const utter=new SpeechSynthesisUtterance(chunks[i++]);
        utter.rate=Number(prefs.rate)||1;utter.voice=synth.getVoices().find(v=>v.voiceURI===prefs.voice)||null;utter.lang=utter.voice?.lang||'en-GB';
        utter.onend=next;utter.onerror=e=>{if(run!==token)return;stopRead();status(`Reading stopped: ${e.error||'speech unavailable'}. Try another voice.`);};
        synth.speak(utter);
      }next();
    }
    async function cloudSpeak(text,label,run){
      const voice=prefs.voice.slice(7), chunks=text.match(/[\s\S]{1,1000}(?:\s|$)|[\s\S]{1,1000}/g)||[text];let index=0;
      async function next(){
        if(run!==token)return;
        if(index===chunks.length){stopRead();status(`Finished ${label}. Microphone remains off.`);return;}
        const chunk=chunks[index++],cacheKey=voice+'|'+chunk;status(`Preparing Google voice: ${label} (${index}/${chunks.length}). Microphone is off.`);
        try{
          let blob=audioCache.get(cacheKey);
          if(!blob){cloudAbort=new AbortController();const response=await fetch('/api/speech',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:chunk,voice}),signal:cloudAbort.signal});
            if(!response.ok)throw new Error(await response.text());blob=await response.blob();if(!blob.type.startsWith('audio/'))throw new Error('Google speech returned no audio.');
            if(run!==token)return;audioCache.set(cacheKey,blob);while(audioCache.size>5)audioCache.delete(audioCache.keys().next().value);
          }
          if(run!==token)return;if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(blob);audio=new Audio(audioUrl);audio.playbackRate=Number(prefs.rate)||1;
          audio.onended=next;audio.onerror=()=>{if(run===token){stopRead();status('Audio playback failed. Choose a browser voice or try again.');}};
          if(!paused){await audio.play();if(run===token)status(`Reading ${label} with Google. Microphone is off.`);}
        }catch(error){if(run!==token)return;stopRead();status((error.message||'Google speech unavailable.')+' Choose a browser voice to continue.');}
      }await next();
    }
    function sourceText(html){const parsed=new DOMParser().parseFromString(html,'text/html');return textOf(parsed.body,true);}
    function sourceSections(html){
      const parsed=new DOMParser().parseFromString(html,'text/html');const sections=[];let current=null;
      for(const el of parsed.body.children){
        if(/^H[1-4]$/.test(el.tagName)&&/^(exhibit|requirements?|required)\b/i.test(el.textContent.trim())){current={label:el.textContent.trim(),html:''};sections.push(current);}
        if(current)current.html+=el.outerHTML;
      }return sections;
    }
    let questionSignature='';
    function questionControls(){
      const full=doc.getElementById('q-full'),button=doc.getElementById('va-full-question');if(!full||!button)return;
      const title=doc.getElementById('q-title')?.textContent||'Question';if(title===questionSignature)return;questionSignature=title;
      const clone=full.cloneNode(true);clone.querySelectorAll('.va-read').forEach(b=>b.remove());const html=clone.innerHTML;
      const sections=sourceSections(html),picker=doc.getElementById('va-exhibit');picker.replaceChildren();
      sections.forEach((section,i)=>picker.add(new Option(section.label,String(i))));
      button.onclick=()=>speakText(sourceText(html),'full question: '+title);
      const readExhibit=doc.getElementById('va-read-exhibit');readExhibit.disabled=!sections.length||!canRead;
      readExhibit.onclick=()=>{const section=sections[Number(picker.value)];if(section)speakText(sourceText(section.html),section.label);};
      button.disabled=!canRead;
    }
    function read(el,label){speakText(textOf(el),label||'section',el);}
    function pause(){if(reading&&!paused){if(prefs.voice.startsWith('google:')&&cloudReady)audio?.pause();else synth.pause();paused=true;$('pause').disabled=true;$('resume').disabled=false;status('Reading paused. Microphone is off.');}}
    function resume(){if(reading&&paused){stopMic();if(prefs.voice.startsWith('google:')&&cloudReady){audio?.play().catch(()=>{stopRead();status('Press Read again to restart audio.');});}else synth.resume();paused=false;$('pause').disabled=false;$('resume').disabled=true;status(`Reading ${lastLabel}. Microphone is off.`);}}
    function voices(){if(!canRead)return;const picker=$('voice');picker.replaceChildren(new Option('Browser default',''));if(cloudReady)for(const name of cloudVoices)picker.add(new Option('Google · '+name,'google:'+name));for(const v of synth.getVoices())picker.add(new Option(`${v.name} · ${v.lang}`,v.voiceURI));if(!prefs.voice){let preferred='';try{preferred=JSON.parse(localStorage.getItem('tba_coach_prefs_v2')||'{}').voiceName||'';}catch(_){}const available=synth.getVoices();const chosen=available.find(v=>v.name===preferred)||available.find(v=>/^en/i.test(v.lang)&&/natural|premium|enhanced|neural/i.test(v.name))||available.find(v=>v.lang==='en-GB');if(chosen)prefs.voice=chosen.voiceURI;}picker.value=prefs.voice; if(picker.selectedIndex<0)picker.value='';}
    function preference(){prefs={rate:Number($('rate').value),voice:$('voice').value};try{localStorage.setItem(KEY,JSON.stringify(prefs));}catch(_){}if(reading)stopRead('Reading stopped. Choose Read again to use the new settings.');bus.dispatchEvent(new CustomEvent('afm-reading-preference',{detail:{owner,prefs}}));}
    bus.addEventListener('afm-reading-preference',e=>{if(e.detail?.owner===owner||!e.detail?.prefs)return;if(reading)stopRead('Reading settings changed. Choose Read again.');prefs={...e.detail.prefs};$('rate').value=String(prefs.rate);voices();});
    function fieldLabel(el){return el.labels?.[0]?.innerText?.trim()||el.getAttribute('aria-label')||el.placeholder||el.name||'Text field';}
    function refreshTargets(){
      const previous=$('target').value;targets.clear();
      const fields=[...doc.querySelectorAll('textarea:not([readonly]),input:not([type]),input[type="text"],input[type="search"],input[type="email"],input[type="tel"],input[type="url"],[contenteditable="true"]')].filter(el=>!el.closest('.va-ui')&&!el.disabled&&!el.readOnly&&visible(el));
      const sig=fields.map(el=>{if(!el.dataset.vaTarget)el.dataset.vaTarget='va-field-'+(++targetCounter);targets.set(el.dataset.vaTarget,el);return el.dataset.vaTarget+fieldLabel(el);}).join('|');
      if($('target').dataset.signature===sig)return;
      $('target').dataset.signature=sig;$('target').replaceChildren(new Option('Choose an answer or text field',''));
      for(const [id,el] of targets)$('target').add(new Option(fieldLabel(el).slice(0,100),id));
      $('target').value=targets.has(previous)?previous:targets.has(lastTarget?.dataset.vaTarget)?lastTarget.dataset.vaTarget:'';
    }
    function writeWords(text){
      const el=lockedTarget;
      if(!el||!visible(el)||el.disabled||el.readOnly){stopMic('Dictation stopped because the chosen field is no longer available.');return;}
      if(el.isContentEditable){
        const range=savedRange&&el.contains(savedRange.commonAncestorContainer)?savedRange.cloneRange():doc.createRange();
        if(!savedRange||!el.contains(savedRange.commonAncestorContainer)){range.selectNodeContents(el);range.collapse(false);}
        range.deleteContents();const node=doc.createTextNode(' '+text+' ');range.insertNode(node);range.setStartAfter(node);range.collapse(true);savedRange=range.cloneRange();
        el.dispatchEvent(new Event('input',{bubbles:true}));status('Dictated into '+fieldLabel(el)+'. Check the text.');return;
      }
      const start=el.selectionStart??el.value.length,end=el.selectionEnd??start;
      const prefix=el.value.slice(0,start),suffix=el.value.slice(end);
      const insert=(prefix&&!/\s$/.test(prefix)?' ':'')+text+(suffix&&!/^\s/.test(suffix)?' ':'');
      const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto,'value').set.call(el,prefix+insert+suffix);
      el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));
      try{el.setSelectionRange(prefix.length+insert.length,prefix.length+insert.length);}catch(_){}
      status('Dictated into '+fieldLabel(el)+'. Check the text and use its normal save control.');
    }
    function clickId(id){const el=doc.getElementById(id);if(!el||!visible(el)){status('Open the relevant lesson or question first.');return;}if(el.disabled){status('Attempt the question first. That help is still locked.');return;}el.click();status('Done.');}
    const tabs={'open library':'library','open question studio':'practice','open study plan':'plan','open method sheets':'sheets','open voice companion':'voice','open lessons':'learn'};
    const routes={'open home':'/','open classroom':'/classroom','open classroom 14':'/classroom-14','open classroom fourteen':'/classroom-14','open training':'/training','open papers':'/past-papers','open progress':'/form-guide','open matchday':'/war-room','open ke finesse':'/ke-finesse'};
    function command(raw){
      const c=raw.toLowerCase().replace(/[.,!?]/g,'').replace(/\s+/g,' ').trim();
      if(!doc.getElementById('learn') && /^(read (full question|lesson|requirements|exhibits|exhibit \d+|hints)|next lesson|previous lesson|next gap|start timer|pause timer|reset timer|save attempt|show hint|show checkpoint|open library|open question studio|open study plan|open method sheets|open voice companion|open lessons)$/.test(c)){
        const frame=doc.querySelector('iframe[src^="/afm-classroom/"]');if(frame?.contentWindow){frame.contentWindow.dispatchEvent(new CustomEvent('afm-voice-command',{detail:{text:raw}}));return;}
      }
      if(c==='stop reading'){stopRead('Reading stopped.');return;}
      if(c==='stop microphone'||c==='stop listening'||c==='stop all'){stopAll();return;}
      if(c==='pause reading'){pause();return;}if(c==='resume reading'){resume();return;}
      if(c==='read full question'){const full=doc.querySelector('[data-va-full-question]');if(full&&visible(full)&&!full.disabled){full.click();}else status('Open a question and wait for its full source to load first.');return;}
      const exhibitNumber=c.match(/^read exhibit (\d+)$/);if(exhibitNumber){const picker=doc.querySelector('[data-va-exhibit-picker]'),button=doc.querySelector('[data-va-read-exhibit]');if(picker&&button){const match=[...picker.options].find(o=>new RegExp('exhibit '+exhibitNumber[1]+'(?:\\D|$)','i').test(o.text));if(match){picker.value=match.value;picker.dispatchEvent(new Event('change',{bubbles:true}));button.click();return;}}status('That exhibit is not available in the current question.');return;}
      if(c==='read page'){read(doc.querySelector('main')||doc.body,'page');return;}
      if(c==='read selection'||c==='read selected text'){speakText(selection,'selected text');return;}
      const readIds={'read lesson':'learn','read requirements':'q-requirements','read exhibits':'q-full','read hints':doc.getElementById('practice')&&!doc.getElementById('practice').hidden?'q-feedback':'lesson-feedback'};
      if(readIds[c]){const el=doc.getElementById(readIds[c]);if(!el||el.closest('section[hidden]')){status('Open the relevant lesson or question first.');return;}if(c==='read exhibits'){const d=el.closest('details');if(d)d.open=true;}read(el,c.slice(5));return;}
      if(tabs[c]){const el=doc.querySelector(`[data-tab="${tabs[c]}"]`);if(el){stopAll('Opened study section. Microphone is off.');el.click();return;}}
      const actions={'next lesson':'next','previous lesson':'previous','next gap':'next-gap','start timer':'timer-start','pause timer':'timer-pause','reset timer':'timer-reset','save attempt':doc.getElementById('practice')&&!doc.getElementById('practice').hidden?'q-commit':'lesson-commit','show hint':doc.getElementById('practice')&&!doc.getElementById('practice').hidden?'q-hint':'hint','show checkpoint':doc.getElementById('practice')&&!doc.getElementById('practice').hidden?'q-reveal':'reveal'};
      if(actions[c]){clickId(actions[c]);return;}
      if(routes[c]){const targetDoc=bus.document;const link=[...targetDoc.querySelectorAll('a[href]')].find(a=>a.getAttribute('href')===routes[c]);if(link){stopAll('Opening page. Microphone is off.');link.click();return;}status('Use this command from the academy page.');return;}
      status('Command not recognised. Open Voice commands and keyboard help for the supported phrases.');
    }
    function startMic(){
      if(!SR){status('Microphone recognition is unavailable in this browser. Use the keyboard and text fields.');return;}
      const mode=$('mode').value;refreshTargets();const target=targets.get($('target').value);
      if(mode==='dictation'&&!target){status('Choose a visible answer or text field before starting dictation.');return;}
      stopMic();if(mode==='commands'&&reading)pause();else stopRead();exclusive('mic');lockedTarget=target||null;
      const run=++micToken;const instance=new SR();rec=instance;instance.lang='en-GB';instance.continuous=true;instance.interimResults=true;
      instance.onstart=()=>{if(run!==micToken)return;listening=true;$('mic').disabled=true;$('mic-stop').disabled=false;status(mode==='dictation'?'Dictation on: '+fieldLabel(lockedTarget):'Commands microphone on. Say a command from the help list.');};
      instance.onresult=e=>{if(run!==micToken)return;for(let i=e.resultIndex;i<e.results.length;i++){const result=e.results[i];const words=result[0].transcript.trim();$('heard').textContent=(result.isFinal?'Heard: ':'Hearing: ')+words;if(result.isFinal){if(mode==='dictation')writeWords(words);else command(words);}if(run!==micToken)break;}};
      instance.onerror=e=>{if(run!==micToken)return;stopMic();status(e.error==='not-allowed'||e.error==='service-not-allowed'?'Microphone permission was refused. You can keep using text and reading controls.':`Microphone stopped: ${e.error||'recognition unavailable'}. Start it again when ready.`);};
      instance.onend=()=>{if(run!==micToken)return;rec=null;listening=false;lockedTarget=null;$('mic').disabled=false;$('mic-stop').disabled=true;status('Microphone off. Start it again when ready.');};
      status('Starting microphone. Your browser may ask permission.');try{instance.start();}catch(_){stopMic('Microphone could not start. Use the keyboard or try again.');}
    }
    $('toggle').onclick=()=>{const panel=ui.querySelector('.va-panel');panel.hidden=!panel.hidden;$('toggle').setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden){refreshTargets();voices();}};
    $('stop-all').onclick=()=>{exclusive('stop');stopAll();};$('page').onclick=()=>read(doc.querySelector('main')||doc.body,'page');$('selection').onclick=()=>speakText(selection,'selected text');$('pause').onclick=pause;$('resume').onclick=resume;$('repeat').onclick=()=>speakText(lastText,lastLabel);
    $('preview').onclick=()=>speakText('This is your AFM reading voice. Take one requirement at a time, explain your method, and check the result.','voice preview');
    $('rate').value=String(prefs.rate);if($('rate').selectedIndex<0)$('rate').value='1';$('rate').onchange=preference;$('voice').onchange=preference;
    $('read-field').disabled=!canRead;$('read-field').onclick=()=>{const el=targets.get($('target').value);if(el&&visible(el))speakText(el.isContentEditable?el.innerText:el.value,fieldLabel(el));else status('Choose a visible text field first.');};
    $('mode').onchange=()=>stopMic('Mode changed. Choose a field for dictation, then start the microphone.');$('target').onchange=()=>stopMic('Dictation field changed. Start the microphone when ready.');$('mic').onclick=startMic;$('mic-stop').onclick=()=>stopMic('Microphone off.');
    $('mic').disabled=!SR;$('mic-stop').disabled=true;$('pause').disabled=true;$('resume').disabled=true;$('repeat').disabled=true;
    if(!canRead){for(const n of ['page','selection','rate','voice','preview'])$(n).disabled=true;status('Read-aloud is unavailable in this browser. Text and study controls still work.');}
    if(!SR){const note=doc.createElement('p');note.className='va-note';note.textContent='Speech recognition is unavailable here. Use typed answers and regular navigation.';$('mic').parentElement.after(note);}
    voices();synth?.addEventListener('voiceschanged',voices);
    if(location.protocol==='https:'||location.hostname==='localhost')fetch('/api/speech').then(r=>r.ok?r.json():null).then(data=>{if(data?.available){cloudReady=true;cloudVoices=data.voices;voices();}}).catch(()=>{});
    function decorate(){
      scheduled=false;
      for(const [el,btn]of controls){if(!visible(el)){btn.remove();controls.delete(el);}}
      const candidates=doc.querySelectorAll('main h1,main h2,main h3,main h4,main p,main li,main blockquote,main pre,main table,main .list-item,body>h1,body>h2,body>h3,body>p,body>table,body>.list-item,#slide-body,#slide-prompt');
      for(const el of candidates){
        if(controls.has(el)||!visible(el)||el.closest('button,a,summary,[role="button"],label,.va-ui')||el.closest('[contenteditable="true"]')||el.parentElement?.closest('li,blockquote,pre,table,.list-item'))continue;
        const text=textOf(el);if(!text)continue;
        const btn=doc.createElement('button');btn.type='button';btn.className='va-read';btn.textContent='Read aloud';btn.setAttribute('aria-label','Read aloud: '+text.slice(0,70));btn.disabled=!canRead;
        btn.onclick=()=>read(el,text.slice(0,45));el.after(btn);controls.set(el,btn);
      }
      refreshTargets();questionControls();
    }
    function schedule(records){if(records && records.every(r=>r.target.nodeType===1&&(r.target.closest?.('.va-ui')||r.target.classList?.contains('va-read'))))return;if(!scheduled){scheduled=true;requestAnimationFrame(decorate);}}
    const observer=new MutationObserver(schedule);observer.observe(doc.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','open','aria-hidden'],characterData:true});
    doc.addEventListener('selectionchange',()=>{const field=doc.activeElement;if(field?.matches('textarea,input')&&field.selectionEnd>field.selectionStart){selection=field.value.slice(field.selectionStart,field.selectionEnd);return;}const s=window.getSelection();if(s?.rangeCount&&s.anchorNode?.parentElement?.closest('[contenteditable="true"]'))savedRange=s.getRangeAt(0).cloneRange();if(s&&!s.isCollapsed&&s.toString().trim()&&!s.anchorNode?.parentElement?.closest('.va-ui'))selection=s.toString();});
    doc.addEventListener('focusin',e=>{if(e.target.matches?.('textarea,input,[contenteditable="true"]')&&!e.target.closest('.va-ui')){lastTarget=e.target;refreshTargets();$('target').value=e.target.dataset.vaTarget||'';}});
    doc.addEventListener('click',e=>{const el=e.target.closest?.('a[href],[data-tab],[data-q],[role="tab"],#next,#previous,#next-gap');if(el&&!el.closest('.va-ui,.va-read'))stopAll('Page or study selection changed. Reading and microphone stopped.');},true);
    doc.addEventListener('change',e=>{if(e.target.id==='lesson-picker'){stopAll('Lesson changed. Reading and microphone stopped.');lastText='';$('repeat').disabled=true;}});
    doc.addEventListener('keydown',e=>{if(e.key==='Escape'){exclusive('stop');stopAll();}});
    const navigation=()=>{exclusive('stop');stopAll('Navigation changed. Reading and microphone stopped.');lastText='';$('repeat').disabled=true;};window.addEventListener('hashchange',navigation);window.addEventListener('popstate',navigation);window.addEventListener('afm-voice-navigation',navigation);window.addEventListener('pagehide',()=>{stopAll();observer.disconnect();});
    window.addEventListener('afm-voice-command',e=>{if(typeof e.detail?.text==='string')command(e.detail.text);});
    window.addEventListener('afm-read-source',e=>{if(e.detail?.html)speakText(sourceText(e.detail.html),e.detail.label||'full question');else if(e.detail?.text)speakText(e.detail.text,e.detail.label||'question');});
    bus.addEventListener('afm-voice-exclusive',e=>{if(e.detail?.owner!==owner)stopAll('Another voice control took over. Microphone is off.');});
    // Older read buttons join the same playback controller and settings.
    const oldLesson=doc.getElementById('read-prompt'),oldQuestion=doc.getElementById('read-q');
    if(oldLesson)oldLesson.onclick=()=>read(doc.querySelector('.slide'),'lesson');
    if(oldQuestion)oldQuestion.onclick=()=>read(doc.getElementById('q-requirements'),'question requirements');
    doc.addEventListener('visibilitychange',()=>{if(doc.hidden)stopAll('Page hidden. Reading and microphone stopped.');});
    // A second legacy voice feature must never feed its output into this microphone.
    setInterval(()=>{if(listening&&synth?.speaking&&!synth?.paused)stopMic('Microphone stopped because speech playback started.');if(activeElement&&!visible(activeElement))stopRead('Reading stopped because the section is no longer visible.');},200);
    schedule();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

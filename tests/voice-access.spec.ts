import {expect,test, type Page} from '@playwright/test';

async function mockSpeech(page:Page, supported=true) {
  await page.addInitScript(({supported})=>{
    const w=window as any;
    const state={logs:[] as string[],queue:[] as any[],starts:0,aborts:0,current:null as any,paused:false,rate:0,voice:''};
    w.__voiceMock=state;
    class Utterance {text:string;rate=1;voice:any;lang='';onend:any;onerror:any;constructor(text:string){this.text=text;}}
    const synth={speaking:false,pending:false,paused:false,getVoices:()=>[{name:'Website English',voiceURI:'site-en',lang:'en-GB',localService:true}],addEventListener(){},removeEventListener(){},cancel(){state.queue=[];this.speaking=false;this.paused=false;},pause(){this.paused=true;state.paused=true;},resume(){this.paused=false;state.paused=false;},speak(u:any){this.speaking=true;state.logs.push(u.text);state.queue.push(u);state.rate=u.rate;state.voice=u.voice?.voiceURI||'';}};
    class Recognition {onstart:any;onend:any;onerror:any;onresult:any;start(){state.starts++;state.current=this;this.onstart?.();}abort(){state.aborts++;if(state.current===this)state.current=null;this.onend?.();}stop(){this.abort();}}
    Object.defineProperty(w,'speechSynthesis',{configurable:true,value:supported?synth:undefined});
    Object.defineProperty(w,'SpeechSynthesisUtterance',{configurable:true,value:supported?Utterance:undefined});
    Object.defineProperty(w,'SpeechRecognition',{configurable:true,value:supported?Recognition:undefined});
    Object.defineProperty(w,'webkitSpeechRecognition',{configurable:true,value:undefined});
    state['emit' as keyof typeof state]=((text:string,final=true)=>{const result:any=[{transcript:text}];result.isFinal=final;state.current?.onresult?.({resultIndex:0,results:[result]});}) as any;
    state['drain' as keyof typeof state]=(()=>{let guard=0;while(state.queue.length&&guard++<10000){const u=state.queue.shift();synth.speaking=false;u.onend?.();}return state.logs.join('');}) as any;
  },{supported});
}
const mock=(page:Page,code:string)=>page.evaluate(code);

test('reading controls preserve gates, playback state and microphone opt-in',async({page})=>{
  await mockSpeech(page);await page.goto('/afm-classroom/classroom14.html');
  const ui=page.locator('.va-ui');await ui.getByRole('button',{name:'Voice & reading',exact:true}).click();
  expect(await mock(page,'window.__voiceMock.starts')).toBe(0);
  await ui.locator('[data-va="rate"]').selectOption('1.3');
  await ui.getByRole('button',{name:'Read page',exact:true}).click();
  await expect(ui.locator('[data-va="pause"]')).toBeEnabled();
  await ui.getByRole('button',{name:'Pause',exact:true}).click();expect(await mock(page,'window.__voiceMock.paused')).toBe(true);
  await ui.getByRole('button',{name:'Resume',exact:true}).click();expect(await mock(page,'window.__voiceMock.paused')).toBe(false);
  const text=await mock(page,'window.__voiceMock.drain()');expect(text).toContain('Fourteen papers');expect(text).not.toContain('Teaching checkpoint:');expect(await mock(page,'window.__voiceMock.rate')).toBe(1.3);
  await ui.getByRole('button',{name:'Start microphone',exact:true}).click();
  await mock(page,"window.__voiceMock.emit('show hint')");await expect(ui.locator('[data-va="status"]')).toContainText('still locked');
  await expect(page.locator('#hint')).toBeDisabled();
  await ui.getByRole('button',{name:'Preview voice',exact:true}).click();expect(await mock(page,'window.__voiceMock.current')).toBeNull();
  await ui.getByRole('button',{name:'Stop all',exact:true}).click();await expect(ui.locator('[data-va="pause"]')).toBeDisabled();
});

test('dictation writes only final words to chosen notes and commands stay separate',async({page})=>{
  await mockSpeech(page);await page.goto('/afm-classroom/classroom14.html');
  await page.locator('#lesson-attempt').fill('My notes.');
  const ui=page.locator('.va-ui');await ui.getByRole('button',{name:'Voice & reading',exact:true}).click();
  await ui.locator('[data-va="mode"]').selectOption('dictation');
  const target=await page.locator('#lesson-attempt').getAttribute('data-va-target');await ui.locator('[data-va="target"]').selectOption(target!);
  await ui.getByRole('button',{name:'Start microphone',exact:true}).click();
  await mock(page,"window.__voiceMock.emit('interim words',false)");await expect(page.locator('#lesson-attempt')).toHaveValue('My notes.');
  await mock(page,"window.__voiceMock.emit('next lesson')");await expect(page.locator('#lesson-attempt')).toHaveValue('My notes. next lesson');await expect(page.locator('#slide-count')).toHaveText('1 / 44');
  await ui.locator('[data-va="mode"]').selectOption('commands');await ui.getByRole('button',{name:'Start microphone',exact:true}).click();
  await mock(page,"window.__voiceMock.emit('next lesson')");await expect(page.locator('#slide-count')).toHaveText('2 / 44');expect(await mock(page,'window.__voiceMock.current')).toBeNull();
  await page.reload();await page.locator('#previous').click();await expect(page.locator('#lesson-attempt')).toHaveValue('My notes. next lesson');
});

test('all 42 full question sources are read completely without teaching answers',async({page})=>{
  test.setTimeout(120000);await mockSpeech(page);await page.goto('/afm-classroom/classroom14.html');
  const ids=await page.evaluate(()=>window.AFM_DATA!.questions.map(q=>q.id));expect(ids).toHaveLength(42);
  for(const id of ids){
    await page.locator('.va-ui [data-va="toggle"]').evaluate(el=>{if(el.getAttribute('aria-expanded')==='true')(el as HTMLButtonElement).click();});
    await page.getByRole('button',{name:'42-question library',exact:true}).click();
    await page.getByRole('button',{name:id,exact:true}).click();
    await mock(page,'window.__voiceMock.logs=[]');await page.getByRole('button',{name:'Read full question',exact:true}).click();
    const spoken=String(await mock(page,'window.__voiceMock.drain()')).replace(/\s/g,'');
    const paragraphs=await page.evaluate(id=>{
      const q=window.AFM_DATA!.questions.find(q=>q.id===id)!;const parsed=new DOMParser().parseFromString(q.fullHtml,'text/html');
      return [...parsed.querySelectorAll('p,h2,h3,h4,td')].map(el=>(el.textContent||'').replace(/\s/g,'')).filter(Boolean);
    },id);
    for(const paragraph of paragraphs)expect(spoken,`${id}: complete source paragraph or table cell`).toContain(paragraph);
    expect(spoken).not.toContain('Expectedoutput(teachingguidance)');
  }
});

test('Sep/Dec 2024 past-paper full reading loads original exhibits and supports exhibit command',async({page})=>{
  await mockSpeech(page);await page.goto('/past-papers?view=questions&p=northney');
  const full=page.getByRole('button',{name:'Read full question',exact:true});await expect(full).toBeEnabled();
  await expect(page.getByText('Full source question loaded: SD24-Q1.',{exact:false})).toBeVisible();
  await full.click();const spoken=await mock(page,'window.__voiceMock.drain()');expect(spoken).toContain('Northney');expect(spoken).toContain('Exhibit 2');expect(spoken).toContain('political and operational risks');expect(spoken).toContain('Row 1.');
  const ui=page.locator('.va-ui');await ui.getByRole('button',{name:'Start microphone',exact:true}).click();await mock(page,"window.__voiceMock.emit('read exhibit 2')");await expect(ui.locator('[data-va="status"]')).toContainText('Exhibit 2');expect(await mock(page,'window.__voiceMock.current')).toBeNull();
});

test('unsupported APIs and denied permission retain text access',async({page})=>{
  await mockSpeech(page,false);await page.goto('/afm-classroom/classroom14.html');
  const ui=page.locator('.va-ui');await ui.getByRole('button',{name:'Voice & reading',exact:true}).click();await expect(ui.getByRole('button',{name:'Start microphone',exact:true})).toBeDisabled();await expect(ui.getByRole('button',{name:'Read page',exact:true})).toBeDisabled();await page.locator('#lesson-attempt').fill('Keyboard works');await expect(page.locator('#lesson-attempt')).toHaveValue('Keyboard works');
});

test('permission denial and page navigation stop microphone without auto restart',async({page})=>{
  await mockSpeech(page);await page.goto('/afm-classroom/classroom14.html');const ui=page.locator('.va-ui');await ui.getByRole('button',{name:'Voice & reading',exact:true}).click();await ui.getByRole('button',{name:'Start microphone',exact:true}).click();
  await mock(page,"window.__voiceMock.current.onerror({error:'not-allowed'})");await expect(ui.locator('[data-va="status"]')).toContainText('permission was refused');expect(await mock(page,'window.__voiceMock.current')).toBeNull();
  await ui.getByRole('button',{name:'Start microphone',exact:true}).click();await mock(page,"window.__voiceMock.emit('open study plan')");await expect(page.locator('#plan')).toBeVisible();expect(await mock(page,'window.__voiceMock.current')).toBeNull();
});

test('reference pages and mobile voice panel offer readable blocks without overflow',async({page})=>{
  await mockSpeech(page);await page.setViewportSize({width:390,height:844});await page.goto('/afm-classroom/materials/cheat-sheets.html');
  await expect(page.locator('.va-read').first()).toBeVisible();await page.locator('.va-read').first().click();await expect(page.locator('.va-ui [data-va="pause"]')).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/voice-mobile.png',fullPage:false});
});

test('commands pause then resume playback with microphone off',async({page})=>{
  await mockSpeech(page);await page.goto('/afm-classroom/classroom14.html');
  const ui=page.locator('.va-ui');await ui.getByRole('button',{name:'Voice & reading',exact:true}).click();await ui.getByRole('button',{name:'Preview voice',exact:true}).click();
  await ui.getByRole('button',{name:'Start microphone',exact:true}).click();expect(await mock(page,'window.__voiceMock.paused')).toBe(true);
  await mock(page,"window.__voiceMock.emit('resume reading')");expect(await mock(page,'window.__voiceMock.current')).toBeNull();expect(await mock(page,'window.__voiceMock.paused')).toBe(false);await expect(ui.locator('[data-va="pause"]')).toBeEnabled();
});

test('dictation reaches a named form field and the CBE rich-text editor',async({page})=>{
  await mockSpeech(page);await page.goto('/afm-classroom/classroom14.html#practice');
  let ui=page.locator('.va-ui');await ui.getByRole('button',{name:'Voice & reading',exact:true}).click();await ui.locator('[data-va="mode"]').selectOption('dictation');
  await ui.locator('[data-va="target"]').selectOption({label:'Error to retry'});await ui.getByRole('button',{name:'Start microphone',exact:true}).click();await mock(page,"window.__voiceMock.emit('Check currency units')");await expect(page.locator('#q-error')).toHaveValue('Check currency units');
  await page.goto('/past-papers?view=questions&p=northney&tab=practice');
  const editor=page.getByRole('textbox',{name:'Word processor',exact:true});await expect(editor).toBeVisible();await editor.fill('Initial note.');
  ui=page.locator('.va-ui');await ui.getByRole('button',{name:'Voice & reading',exact:true}).click();await ui.locator('[data-va="mode"]').selectOption('dictation');await ui.locator('[data-va="target"]').selectOption({label:'Word processor'});await ui.getByRole('button',{name:'Start microphone',exact:true}).click();await mock(page,"window.__voiceMock.emit('Additional reasoning <b>literal</b>')");
  await expect(editor).toContainText('Additional reasoning <b>literal</b>');await expect(editor.locator('b')).toHaveCount(0);
  await ui.getByRole('button',{name:'Stop microphone',exact:true}).click();await expect.poll(()=>page.evaluate(()=>Object.values(localStorage).some(v=>v.includes('Additional reasoning')))).toBe(true);await page.reload();await expect(page.getByRole('textbox',{name:'Word processor',exact:true})).toContainText('Additional reasoning <b>literal</b>');
});

test('a deliberately minimised panel stays minimised while reading',async({page})=>{
  await mockSpeech(page);await page.goto('/afm-classroom/classroom14.html');
  const ui=page.locator('.va-ui'),panel=ui.locator('.va-panel'),toggle=ui.getByRole('button',{name:'Voice & reading',exact:true});
  await toggle.click();await expect(panel).toBeVisible();
  await toggle.click();await expect(panel).toBeHidden();
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('afm-read-source',{detail:{text:'Reading while the controls are collapsed.',label:'probe'}})));
  await expect(ui.locator('[data-va="short"]')).toHaveText('Reading');
  await expect(panel).toBeHidden();
  await toggle.click();await expect(panel).toBeVisible();
});

test('academy microphone can request the embedded full question without self-triggering',async({page})=>{
  await mockSpeech(page);await page.goto('/classroom-14');const room=page.frameLocator('iframe');await room.getByRole('button',{name:'Question studio',exact:true}).click();
  const ui=page.locator('.va-ui');await ui.getByRole('button',{name:'Voice & reading',exact:true}).click();await ui.getByRole('button',{name:'Start microphone',exact:true}).click();await mock(page,"window.__voiceMock.emit('read full question')");
  await expect(room.locator('.va-ui [data-va="status"]')).toContainText('Reading full question');expect(await mock(page,'window.__voiceMock.current')).toBeNull();
});

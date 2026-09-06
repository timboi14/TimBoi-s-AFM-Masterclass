import { useEffect, useMemo, useRef, useState } from 'react';
import type { Paper } from '@/data/pastpapers/schema';

type Source = { id: string; name: string; fullHtml: string };
declare global { interface Window { AFM_DATA?: { questions: Source[] } } }
let sourceLoad: Promise<Source[]> | undefined;
function loadSources() {
  if (window.AFM_DATA) return Promise.resolve(window.AFM_DATA.questions);
  if (!sourceLoad) sourceLoad = new Promise<Source[]>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/afm-classroom/data.js';
    script.onload = () => window.AFM_DATA ? resolve(window.AFM_DATA.questions) : reject(new Error('Source data unavailable'));
    script.onerror = () => { sourceLoad = undefined; script.remove(); reject(new Error('Source download failed')); };
    document.head.append(script);
  });
  return sourceLoad;
}
const escape = (text: string) => text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const normalize = (s: string) => s.toLowerCase().replace(/\bco\b|\bgroup\b/g,'').replace(/[^a-z0-9]/g,'');
function siteContext(paper: Paper) {
  return `<h2>${escape(paper.name)}</h2>` + paper.scenarioSteps.map(s => `<h3>${escape(s.title)}</h3><p>${escape(s.content)}</p>` + (s.table ? `<table><thead><tr>${s.table.headers.map(h=>`<th>${escape(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(row=>`<tr>${row.map(c=>`<td>${escape(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'' )).join('') + (paper.exhibits||[]).map(e=>`<h3>${escape(e.title)}</h3><p>${escape(e.content)}</p>`).join('') + '<h3>Requirements</h3>' + paper.questionParts.map(p=>`<p>${escape(p.label)}. ${escape(p.requirement)}. ${p.marks} marks.</p>`).join('');
}
function sections(html: string) {
  const parsed = new DOMParser().parseFromString(html,'text/html');
  const parts: Array<{label:string;html:string}> = [];let current: typeof parts[number] | undefined;
  for(const el of parsed.body.children) {
    if(el.tagName==='H3') {current={label:el.textContent||'Section',html:''};parts.push(current);}
    if(current)current.html+=el.outerHTML;
  }
  return parts;
}
export function QuestionReadAloud({paper}: {paper:Paper}) {
  const [source,setSource]=useState<{html:string;notice:string}|null>(null);
  const [failed,setFailed]=useState(false), [retry,setRetry]=useState(0);
  const canRead=!!(window.speechSynthesis && window.SpeechSynthesisUtterance);
  const picker=useRef<HTMLSelectElement>(null);
  useEffect(()=>{
    let live=true;setSource(null);setFailed(false);
    loadSources().then(questions=>{
      if(!live)return;
      const matches=questions.filter(q=>q.name.split('/').some(name=>normalize(paper.name).includes(normalize(name.trim()))));
      if(matches.length===1)setSource({html:matches[0].fullHtml,notice:`Full source question loaded: ${matches[0].id}. Scenario, exhibits and requirements only.`});
      else setSource({html:siteContext(paper),notice:'Reads all question context available in this site. A matching full source was not identified; consult the original paper for completeness.'});
    }).catch(()=>{if(live)setFailed(true);});
    return()=>{live=false;window.dispatchEvent(new Event('afm-voice-navigation'));};
  },[paper.id,retry]);
  const parts=useMemo(()=>source?sections(source.html):[],[source]);
  const read=(html:string,label:string)=>window.dispatchEvent(new CustomEvent('afm-read-source',{detail:{html,label}}));
  return <div className="my-4 rounded-xl border border-border bg-white p-4" aria-label="Question reading">
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className="btn btn-primary" data-va-full-question disabled={!source||!canRead} onClick={()=>source&&read(source.html,`${paper.name}: full question`)}>Read full question</button>
      <label className="text-xs font-bold">Jump to exhibit or section<select className="ml-2 max-w-full rounded-lg border border-border p-2 font-body font-normal" ref={picker} data-va-exhibit-picker disabled={!parts.length}>{parts.map((part,i)=><option key={i} value={i}>{part.label}</option>)}</select></label>
      <button type="button" className="btn btn-outline" data-va-read-exhibit disabled={!parts.length||!canRead} onClick={()=>{const part=parts[Number(picker.current?.value)||0];if(part)read(part.html,part.label);}}>Read this exhibit</button>
    </div>
    <p className="mt-2 text-xs text-muted" role="status">{failed?'The full source could not load. Retry before reading.':source?.notice||'Loading complete question source…'}</p>
    {failed&&<button type="button" className="btn btn-outline" onClick={()=>setRetry(n=>n+1)}>Retry question source</button>}
  </div>;
}

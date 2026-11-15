import { recordEvent } from '@/lib/db/events';
import { schedule, newCard, type FsrsCardState, type Rating } from '@/lib/fsrs';
import { SUBJECT } from '@/data/curriculum';

export interface SourceDoc { id: string; title: string; filename: string; pages: number; kind: string; sha256: string; original: string; content: string; note: string; }
export interface SourcePage { page: number; text: string; title?: string; rows?: { row: number; cells: Record<string, string> }[]; image?: string; }
export interface StudyTask { id: string; title: string; source: string; start: number; end: number; answerStart?: number; answerEnd?: number; topic: string; kind: 'learn' | 'practice' | 'revision'; minutes: number; status: 'current' | 'mixed' | 'reference'; caution?: string; priority?: boolean; }
export interface Catalogue { version: 1; subject: string; verifiedOn: string; documents: SourceDoc[]; tasks: StudyTask[]; top51?: { name: string; topic: string; reference: string; matchedTask?: string; row: number }[]; }
export interface Attempt { at: number; response: string; score: number; available: number; correction: string; minutes: number; sheet?: string[][]; }
export interface TaskProgress { response: string; recall: string; read?: boolean; attempts: Attempt[]; fsrs?: FsrsCardState; }
export type Progress = Record<string, TaskProgress>;
export interface PlannerSettings { weekdayMinutes: number; saturdayMinutes: number; sundayMinutes: number; eveningStart: string; examDate: string; }
export const DEFAULT_PLANNER: PlannerSettings = { weekdayMinutes: 60, saturdayMinutes: 120, sundayMinutes: 90, eveningStart: '19:30', examDate: SUBJECT === 'AFM' ? '2027-03-05' : '2027-03-03' };
const PROGRESS_KEY = `tba_library_${SUBJECT.toLowerCase()}_v1`;
const PLANNER_KEY = `tba_library_plan_${SUBJECT.toLowerCase()}_v1`;
export function readProgress(): Progress { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; } }
export function saveProgress(p: Progress) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); window.dispatchEvent(new Event('library-progress')); }
export function readPlanner(): PlannerSettings { try { return { ...DEFAULT_PLANNER, ...JSON.parse(localStorage.getItem(PLANNER_KEY) || '{}') }; } catch { return DEFAULT_PLANNER; } }
export function savePlanner(p: PlannerSettings) { localStorage.setItem(PLANNER_KEY, JSON.stringify(p)); }
export function emptyProgress(): TaskProgress { return { response: '', recall: '', attempts: [] }; }
export function completeReading(task: StudyTask, p: Progress): Progress {
 const previous = p[task.id] || emptyProgress();
 if (!previous.recall.trim()) throw new Error('Write what you can explain from memory before completing this reading.');
 const next = { ...p, [task.id]: { ...previous, read: true } }; saveProgress(next);
 if (!previous.read) recordEvent('note_read', { ref: task.id, minutes: task.minutes });
 return next;
}
export function saveAttempt(task: StudyTask, p: Progress, input: Omit<Attempt, 'at'>, now = Date.now()): Progress {
 if (!input.response.trim() || !input.correction.trim()) throw new Error('Save your answer and a specific correction or takeaway.');
 if (!Number.isFinite(input.score) || !Number.isFinite(input.available) || input.available <= 0 || input.score < 0 || input.score > input.available) throw new Error('Enter valid marks: awarded must be between zero and the available marks.');
 const prev = p[task.id] || emptyProgress(); const pct = input.score / input.available;
 const rating: Rating = pct < .5 ? 1 : pct < .7 ? 2 : pct < .85 ? 3 : 4;
 const fsrs = schedule(prev.fsrs || newCard(now), rating, now).state;
 const next = { ...p, [task.id]: { ...prev, response: input.response, fsrs, attempts: [...prev.attempts, { ...input, at: now }] } };
 saveProgress(next); recordEvent('answer_marked', { ref: task.id, value: Math.round(pct * 100), minutes: input.minutes }); return next;
}
export function taskState(task: StudyTask, p: Progress, now = Date.now()) {
 const s = p[task.id];
 if (task.kind !== 'practice') return s?.read ? 'read' : 'new';
 if (!s?.attempts.length) return 'new';
 if ((s.fsrs?.due || 0) <= now) return 'due';
 // Two successful attempts on different days establish a stronger signal than one immediate repeat.
 const good = s.attempts.filter(a => a.score / a.available >= .7);
 return new Set(good.map(a => new Date(a.at).toDateString())).size >= 2 ? 'secure' : 'review scheduled';
}
export function orderedTasks(tasks: StudyTask[], p: Progress, now = Date.now()): StudyTask[] {
 return tasks.filter(t => t.status === 'current' && taskState(t, p, now) !== 'read' && (taskState(t, p, now) === 'new' || taskState(t, p, now) === 'due')).sort((a,b) => {
  const rank = (t: StudyTask) => taskState(t,p,now)==='due' ? -100 : 0;
  return rank(a)-rank(b);
 });
}
export interface PlanSlot { date: string; start: string; minutes: number; tasks: { task: StudyTask; minutes: number; continuation: boolean }[]; }
export function buildPlan(tasks: StudyTask[], p: Progress, settings: PlannerSettings, from = new Date()): { slots: PlanSlot[]; backlogMinutes: number; capacity: number; required: number } {
 const queue = orderedTasks(tasks,p,from.getTime()); let index=0, consumed=0;
 const slots: PlanSlot[]=[]; const end = new Date(`${settings.examDate}T00:00:00`); const day=new Date(from); day.setHours(0,0,0,0);
 let capacity=0; const required=queue.reduce((n,t)=>n+t.minutes,0);
 for(let i=0;i<400 && day<end;i++,day.setDate(day.getDate()+1)) {
  const dow=day.getDay(); const weekday= SUBJECT==='APM' ? [1,3].includes(dow) : [2,4].includes(dow);
  const minutes = dow===6 ? settings.saturdayMinutes : dow===0 ? settings.sundayMinutes : weekday ? settings.weekdayMinutes : 0;
  if(!Number.isFinite(minutes)||minutes<=0)continue;
  const evening = /^\d{2}:\d{2}$/.test(settings.eveningStart) ? (settings.eveningStart < '19:00' ? '19:00' : settings.eveningStart > '21:00' ? '21:00' : settings.eveningStart) : '19:30';
  const start = dow===6 ? (SUBJECT==='APM'?'09:00':'14:00') : dow===0 ? (SUBJECT==='APM'?'09:00':'14:00') : evening;
  if(day.toDateString()===from.toDateString() && new Date(`${localDate(day)}T${start}:00`) < from) continue;
  capacity+=minutes;
  let left=minutes; const assigned: PlanSlot['tasks']=[];
  while(index<queue.length && left>0){const task=queue[index]; const used=Math.min(left,task.minutes-consumed); assigned.push({task,minutes:used,continuation:consumed>0});left-=used;consumed+=used;if(consumed>=task.minutes){index++;consumed=0;}}
  slots.push({date:localDate(day),start,minutes,tasks:assigned});
 }
 return {slots,capacity,required,backlogMinutes:Math.max(0,required-capacity)};
}
export function localDate(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

// User-provided books are a personal library. Importing stores files on this browser,
// never in an API or a public repository. The same pack can be served locally in development.
let libraryDb: Promise<IDBDatabase> | undefined;
function db() { return libraryDb ||= new Promise<IDBDatabase>((resolve,reject)=>{
 let settled=false;const fail=()=>{if(settled)return;settled=true;clearTimeout(timer);reject(new Error('Browser source storage is unavailable or blocked. Close other study-room tabs and try again.'));};
 const timer=setTimeout(fail,5000);const r=indexedDB.open('tba-personal-sources',1);
 r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onblocked=fail;r.onerror=fail;
 r.onsuccess=()=>{if(settled){r.result.close();return;}settled=true;clearTimeout(timer);r.result.onversionchange=()=>{r.result.close();libraryDb=undefined;};resolve(r.result);};
 }); }
async function stored(path:string):Promise<Blob|undefined>{ const d=await db();return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Source storage read timed out.')),5000);const r=d.transaction('files').objectStore('files').get(`${SUBJECT}/${path}`);r.onsuccess=()=>{clearTimeout(timer);resolve(r.result);};r.onerror=()=>{clearTimeout(timer);reject(r.error);};}); }
export async function readFile(path:string):Promise<Blob> {
 try { const b=await stored(path);if(b)return b; }catch { /* local server remains usable */ }
 const r=await fetch(`/personal-library/${path}`);if(!r.ok || r.headers.get('content-type')?.includes('text/html'))throw new Error('Import your personal library folder to open these sources on this device.'); return r.blob();
}
export async function loadCatalogue():Promise<Catalogue>{ const c=JSON.parse(await (await readFile('catalog.json')).text());validateCatalogue(c);return c; }
export function validateCatalogue(c:Catalogue) { if(c.version!==1||c.subject!==SUBJECT||!Array.isArray(c.documents)||!Array.isArray(c.tasks))throw new Error(`Choose the ${SUBJECT} library folder.`);const ids=new Set(c.documents.map(d=>d.id));if(c.tasks.some(t=>!ids.has(t.source)||t.start<1||t.end<t.start))throw new Error('The library has invalid page references.'); }
export async function importLibrary(files:File[]):Promise<Catalogue>{
 const byPath=new Map(files.map(f=>{ const path=f.webkitRelativePath || f.name;return [path.includes('/')?path.substring(path.indexOf('/')+1):path,f];}));
 const manifest=byPath.get('catalog.json');if(!manifest)throw new Error('Select the whole subject library folder, including catalog.json.');
 const c:Catalogue=JSON.parse(await manifest.text());validateCatalogue(c);
 for(const doc of c.documents){const f=byPath.get(doc.original);if(!f || !byPath.get(doc.content))throw new Error(`Missing original or extracts: ${doc.title}`);const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await f.arrayBuffer()))).map(b=>b.toString(16).padStart(2,'0')).join('');if(hash!==doc.sha256)throw new Error(`The original file does not match: ${doc.title}`);}
 const database=await db();await new Promise<void>((resolve,reject)=>{const tx=database.transaction('files','readwrite');for(const [path,file]of byPath)tx.objectStore('files').put(file,`${SUBJECT}/${path}`);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(new Error('Could not save the library. Check available browser storage.'));tx.onabort=()=>reject(new Error('Import interrupted. Previous library was preserved.'));});
 await navigator.storage?.persist?.();return c;
}
export async function loadPages(doc:SourceDoc):Promise<SourcePage[]> { return JSON.parse(await(await readFile(doc.content)).text()).pages; }
export async function originalUrl(doc:SourceDoc):Promise<string>{return URL.createObjectURL(await readFile(doc.original));}

/** Download floating local study sessions for the user's Gaborone schedule. */
export function downloadCalendar(slots: PlanSlot[]): void {
 const escape=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const stamp=(d:Date)=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//TimBoi Academy//Personal Study Plan//EN','CALSCALE:GREGORIAN'];
 for(const slot of slots){const start=new Date(`${slot.date}T${slot.start}:00+02:00`);const end=new Date(start.getTime()+slot.minutes*60000);lines.push('BEGIN:VEVENT',`UID:${SUBJECT}-${slot.date}@timboi-academy`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${SUBJECT} study session`,`DESCRIPTION:${escape(slot.tasks.map(a=>`${a.continuation?'Continue: ':''}${a.task.title} (${a.minutes} min)`).join('\n')||'Review buffer or mixed practice')}`,'END:VEVENT');}
 lines.push('END:VCALENDAR');const url=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`${SUBJECT}-March-2027-study-plan.ics`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

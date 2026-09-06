/**
 * Server-only Gemini speech. Character quotas are durable while Upstash answers and
 * best-effort otherwise, so losing the quota store throttles speech instead of disabling it.
 */
export const config = { runtime: 'edge' };
const VOICES = ['Kore', 'Puck', 'Charon', 'Aoede'];
const DURABLE_IP = 100000, DURABLE_GLOBAL = 250000;
// Best-effort counters live in a single edge isolate and reset when it recycles, so they sit
// well below the durable limits to bound spend across however many isolates are warm.
const LOCAL_IP = 20000, LOCAL_GLOBAL = 50000;
const localUse = new Map<string, number>(); let localDay = -1;
let durableFailures = 0, durableRetryAt = 0;
function localQuota(ip: string, day: number, chars: number): boolean {
  if (day !== localDay) { localUse.clear(); localDay = day; }
  const perIp = (localUse.get(ip) || 0) + chars, total = (localUse.get('*') || 0) + chars;
  localUse.set(ip, perIp); localUse.set('*', total);
  return perIp <= LOCAL_IP && total <= LOCAL_GLOBAL;
}
const reply = (message: string, status: number) => new Response(message, {status, headers:{'cache-control':'no-store'}});
export default async function handler(req: Request): Promise<Response> {
  const key = process.env.GEMINI_API_KEY;
  const redis = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const durable = !!(redis && redisToken);
  if (req.method === 'GET') return Response.json({available:!!key, durableQuota:durable, voices:VOICES}, {headers:{'cache-control':'no-store'}});
  if (req.method !== 'POST') return reply('Method not allowed',405);
  if (!key) return reply('Google speech is unavailable. Choose a browser voice.',503);
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return reply('Origin not allowed',403);
  if (Number(req.headers.get('content-length')) > 12000) return reply('Text too long',413);
  let body;
  try { const raw=await req.text(); if(raw.length>12000)return reply('Text too long',413); body=JSON.parse(raw); } catch {return reply('Invalid request',400);}
  if (!body || typeof body.text !== 'string' || !body.text.trim() || body.text.length>1200 || !VOICES.includes(body.voice)) return reply('Use 1–1200 characters and a supported voice.',400);
  const day=Math.floor(Date.now()/86400000), ip=(req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();
  let counted=false;
  if (durable && Date.now()>=durableRetryAt) {
    let answered=false, over=false;
    try {
      const quota=await fetch(`${redis!.replace(/\/$/,'')}/pipeline`,{method:'POST',signal:AbortSignal.timeout(3000),headers:{authorization:`Bearer ${redisToken}`,'content-type':'application/json'},body:JSON.stringify([
        ['INCRBY',`speech:ip:${ip}:${day}`,body.text.length],['EXPIRE',`speech:ip:${ip}:${day}`,86400,'NX'],
        ['INCRBY',`speech:global:${day}`,body.text.length],['EXPIRE',`speech:global:${day}`,86400,'NX']
      ])});
      const counts=quota.ok?await quota.json():null;
      if(Array.isArray(counts)&&Number.isFinite(counts[0]?.result)&&Number.isFinite(counts[2]?.result)&&!counts.some((x:any)=>x.error)){
        answered=true;over=counts[0].result>DURABLE_IP||counts[2].result>DURABLE_GLOBAL;counted=!over;
      }
    } catch {}
    // Stop a dead store adding its latency to every chunk of a long read.
    if(answered)durableFailures=0;else if(++durableFailures>=3){durableRetryAt=Date.now()+60000;durableFailures=0;}
    if(over)return reply('Daily Google speech limit reached. Choose a browser voice.',429);
  }
  // An absent or unreachable durable store degrades to the tighter in-isolate budget rather
  // than taking the whole feature offline.
  if (!counted) {
    console.warn('[speech] durable quota unavailable; applying best-effort limits');
    if(!localQuota(ip,day,body.text.length))return reply('Daily Google speech limit reached. Choose a browser voice.',429);
  }
  try {
    const res=await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {method:'POST',signal:AbortSignal.timeout(55000),headers:{'x-goog-api-key':key,'content-type':'application/json'},body:JSON.stringify({
      model:process.env.GEMINI_TTS_MODEL||'gemini-3.1-flash-tts-preview',
      input:'Read the following text exactly, in a calm, natural, clear teaching voice. Do not add commentary.\n\n'+body.text,
      response_format:{type:'audio'},generation_config:{speech_config:[{voice:body.voice}]},store:false
    })});
    if(!res.ok) {console.warn('[speech] provider status',res.status);return reply('Google speech could not generate audio. Choose a browser voice or try again.',502);}
    const result=await res.json();
    const audio=result.steps?.filter((x:any)=>x.type==='model_output').flatMap((x:any)=>x.content||[]).find((x:any)=>x.type==='audio') || result.output_audio || result.outputs?.find((x:any)=>x.type==='audio') || result.output?.find((x:any)=>x.type==='audio');
    if(!audio?.data) return reply('Google returned no audio. Choose a browser voice.',502);
    const pcm=Uint8Array.from(atob(audio.data),(c)=>c.charCodeAt(0));
    if(pcm.length>=12 && String.fromCharCode(...pcm.slice(0,4))==='RIFF')return new Response(pcm,{headers:{'content-type':'audio/wav','cache-control':'private, no-store'}});
    if(['audio/mp3','audio/mpeg','audio/ogg','audio/flac','audio/aac'].includes(audio.mime_type))return new Response(pcm,{headers:{'content-type':audio.mime_type,'cache-control':'private, no-store'}});
    const wav=new Uint8Array(44+pcm.length),v=new DataView(wav.buffer);
    const str=(at:number,s:string)=>{for(let i=0;i<s.length;i++)wav[at+i]=s.charCodeAt(i);};
    str(0,'RIFF');v.setUint32(4,36+pcm.length,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,24000,true);v.setUint32(28,48000,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,pcm.length,true);wav.set(pcm,44);
    return new Response(wav,{headers:{'content-type':'audio/wav','cache-control':'private, no-store'}});
  } catch {return reply('Google speech timed out or returned invalid audio. Choose a browser voice.',502);}
}

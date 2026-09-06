import {test,expect} from '@playwright/test';
import handler from '../api/speech';

test('speech endpoint validates input, fails closed and wraps PCM as WAV',async()=>{
  const original=globalThis.fetch;const saved={...process.env};
  process.env.GEMINI_API_KEY='test-only';process.env.UPSTASH_REDIS_REST_URL='https://quota.example';process.env.UPSTASH_REDIS_REST_TOKEN='test-only';
  const request=(body:any)=>new Request('https://site.example/api/speech',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  let calls=0;
  try{
    globalThis.fetch=async()=>{calls++;return Response.json([{result:10},{result:1},{result:10},{result:1}]);};
    expect((await handler(request({text:'hello',voice:'invalid'}))).status).toBe(400);expect(calls).toBe(0);
    globalThis.fetch=async()=>{throw new Error('quota offline');};expect((await handler(request({text:'hello',voice:'Kore'}))).status).toBe(503);
    globalThis.fetch=async()=>Response.json([{result:100001},{result:1},{result:100001},{result:1}]);expect((await handler(request({text:'hello',voice:'Kore'}))).status).toBe(429);
    globalThis.fetch=async(url,options)=>{
      if(String(url).includes('quota.example'))return Response.json([{result:10},{result:1},{result:10},{result:1}]);
      expect((options?.headers as any)['x-goog-api-key']).toBe('test-only');
      return Response.json({steps:[{type:'model_output',content:[{type:'audio',data:'AAAAAA=='}]}]});
    };
    const result=await handler(request({text:'hello',voice:'Kore'}));expect(result.status).toBe(200);expect(result.headers.get('cache-control')).toContain('no-store');
    const buffer=await result.arrayBuffer();expect(new TextDecoder().decode(buffer.slice(0,4))).toBe('RIFF');expect(new DataView(buffer).getUint32(24,true)).toBe(24000);expect(buffer.byteLength).toBe(48);
  }finally{globalThis.fetch=original;process.env=saved;}
});

test('Google reader pauses, resumes, repeats from cache and stops playback',async({page})=>{
  let requests=0;
  await page.route('**/api/speech',async route=>{
    if(route.request().method()==='GET')return route.fulfill({json:{available:true,voices:['Kore','Puck']}});
    requests++;await route.fulfill({contentType:'audio/wav',body:Buffer.from('test audio')});
  });
  await page.addInitScript(()=>{
    const w=window as any;w.__cloud={plays:0,pauses:0};
    w.Audio=class {src='';playbackRate=1;onended:any;onerror:any;constructor(src:string){this.src=src;}play(){w.__cloud.plays++;return Promise.resolve();}pause(){w.__cloud.pauses++;}};
  });
  await page.goto('/afm-classroom/classroom14.html');const ui=page.locator('.va-ui');
  await ui.locator('[data-va="toggle"]').click();await expect(ui.locator('[data-va="voice"] option[value="google:Kore"]')).toHaveCount(1);
  await ui.locator('[data-va="voice"]').selectOption('google:Kore');await ui.locator('[data-va="preview"]').click();await expect(ui.locator('[data-va="status"]')).toContainText('with Google');
  await ui.locator('[data-va="pause"]').click();await expect(ui.locator('[data-va="status"]')).toContainText('paused');
  await ui.locator('[data-va="resume"]').click();expect(await page.evaluate(()=>(window as any).__cloud.plays)).toBe(2);
  await ui.locator('[data-va="repeat"]').click();await expect(ui.locator('[data-va="status"]')).toContainText('with Google');expect(requests).toBe(1);
  await ui.locator('[data-va="stop-all"]').click();await expect(ui.locator('[data-va="status"]')).toContainText('stopped');
});

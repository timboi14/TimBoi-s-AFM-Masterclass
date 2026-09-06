import {test,expect} from '@playwright/test';
import handler from '../api/speech';

test('speech endpoint validates input, keeps working without a quota store and wraps PCM as WAV',async()=>{
  const original=globalThis.fetch;const saved={...process.env};
  process.env.GEMINI_API_KEY='test-only';process.env.UPSTASH_REDIS_REST_URL='https://quota.example';process.env.UPSTASH_REDIS_REST_TOKEN='test-only';
  const request=(body:any,ip='203.0.113.1')=>new Request('https://site.example/api/speech',{method:'POST',headers:{'content-type':'application/json','x-forwarded-for':ip},body:JSON.stringify(body)});
  const audio=()=>Response.json({steps:[{type:'model_output',content:[{type:'audio',data:'AAAAAA=='}]}]});
  const offlineQuota=async(url:any)=>{if(String(url).includes('quota.example'))throw new Error('quota offline');return audio();};
  let calls=0;
  try{
    globalThis.fetch=async()=>{calls++;return Response.json([{result:10},{result:1},{result:10},{result:1}]);};
    expect((await handler(request({text:'hello',voice:'invalid'}))).status).toBe(400);expect(calls).toBe(0);
    // A quota store that is down throttles speech; it must not take the feature offline.
    globalThis.fetch=offlineQuota as any;
    expect((await handler(request({text:'hello',voice:'Kore'},'203.0.113.2'))).status).toBe(200);
    // Durable limits still refuse once the store answers and the day's budget is spent.
    globalThis.fetch=(async(url:any)=>String(url).includes('quota.example')?Response.json([{result:100001},{result:1},{result:100001},{result:1}]):audio()) as any;
    expect((await handler(request({text:'hello',voice:'Kore'},'203.0.113.3'))).status).toBe(429);
    // The best-effort budget refuses once exhausted, so a dead store cannot mean unlimited spend.
    globalThis.fetch=offlineQuota as any;
    const long='x'.repeat(1200);let last=200;
    for(let i=0;i<25&&last===200;i++)last=(await handler(request({text:long,voice:'Kore'},'203.0.113.4'))).status;
    expect(last).toBe(429);
    globalThis.fetch=async(url,options)=>{
      if(String(url).includes('quota.example'))return Response.json([{result:10},{result:1},{result:10},{result:1}]);
      expect((options?.headers as any)['x-goog-api-key']).toBe('test-only');
      return audio();
    };
    const result=await handler(request({text:'hello',voice:'Kore'},'203.0.113.5'));expect(result.status).toBe(200);expect(result.headers.get('cache-control')).toContain('no-store');
    const buffer=await result.arrayBuffer();expect(new TextDecoder().decode(buffer.slice(0,4))).toBe('RIFF');expect(new DataView(buffer).getUint32(24,true)).toBe(24000);expect(buffer.byteLength).toBe(48);
    // Google voices stay on offer when only the optional quota store is unset.
    process.env.UPSTASH_REDIS_REST_URL='';process.env.UPSTASH_REDIS_REST_TOKEN='';
    expect(await (await handler(new Request('https://site.example/api/speech'))).json()).toMatchObject({available:true,durableQuota:false});
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

test('Google voice choice reaches the embedded classroom and stop cancels preparation',async({page})=>{
  let pending:any;
  await page.route('**/api/speech',async route=>{
    if(route.request().method()==='GET')return route.fulfill({json:{available:true,voices:['Kore']}});
    pending=route;await new Promise<void>(resolve=>{(route as any).release=resolve;});
  });
  await page.goto('/classroom-14');const root=page.locator('body > .va-ui');
  await root.locator('[data-va="toggle"]').click();await expect(root.locator('option[value="google:Kore"]')).toHaveCount(1);await root.locator('[data-va="voice"]').selectOption('google:Kore');await root.locator('[data-va="toggle"]').click();
  const frame=page.frameLocator('iframe');const ui=frame.locator('.va-ui');await ui.locator('[data-va="toggle"]').click();await expect(ui.locator('[data-va="voice"]')).toHaveValue('google:Kore');
  await ui.locator('[data-va="preview"]').click();await expect(ui.locator('[data-va="status"]')).toContainText('Preparing Google');await expect.poll(()=>!!pending).toBe(true);
  await ui.locator('[data-va="stop-all"]').click();pending.release();await expect(ui.locator('[data-va="status"]')).toContainText('stopped');await expect(ui.locator('[data-va="resume"]')).toBeDisabled();
});

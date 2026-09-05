import { expect, test } from '@playwright/test';

for (const route of ['/classroom', '/classroom-14']) {
test(route + ' tab preserves attempt-first learning and portable progress', async ({ page }) => {
  page.on('console', m => {if(m.type()==='error') console.log('BROWSER',m.text());});
  page.on('pageerror', e => console.log('PAGE ERROR',e.message));
  await page.goto(route);
  await expect(page.getByRole('heading', {name:route === '/classroom-14' ? 'Classroom 14' : 'AFM classroom',exact:true})).toBeVisible();
  await expect(page.getByRole('link', {name:route === '/classroom-14' ? 'Classroom 14' : 'Classroom',exact:true}).first()).toHaveAttribute('href',route);
  const room=page.frameLocator('iframe[title="Interactive AFM classroom"]');
  await expect(room.locator('#reveal')).toBeDisabled();
  await expect(room.locator('#lesson-picker option')).toHaveCount(44);
  await room.getByRole('button',{name:'42-question library',exact:true}).click();
  await expect(room.locator('#library tbody tr')).toHaveCount(42);
  await room.locator('#day-filter').selectOption('4');
  await expect(room.locator('#library tbody tr')).toHaveCount(6);
  await room.getByRole('button',{name:'MJ26-Q1',exact:true}).first().click();
  await expect(room.locator('#q-hint')).toBeDisabled();
  await room.locator('#q-attempt').fill('Short futures; margin is refundable.');
  await room.locator('#q-commit').click();
  await room.locator('#q-confidence').selectOption('2');
  await room.locator('#q-error').fill('Margin sign');
  await room.locator('#q-hint').click();
  await room.locator('#timer-start').click();
  await expect(room.locator('#timer-display')).not.toHaveText('12:00');
  await room.locator('#timer-pause').click();
  await room.locator('#voice-prompt').click();
  await expect(room.locator('#tutor-prompt')).toHaveValue(/Margin sign/);
  await expect(room.locator('#tutor-prompt')).toHaveValue(/\/afm-classroom\/papers\//);
  const download=page.waitForEvent('download');
  await room.locator('#export').click();
  const backup=await download;
  const backupPath=await backup.path();
  expect(backupPath).toBeTruthy();
  await page.reload();
  await room.getByRole('button',{name:'Question studio',exact:true}).click();
  await expect(room.locator('#q-attempt')).toHaveValue('Short futures; margin is refundable.');
  await room.locator('#q-attempt').fill('Changed');
  await room.locator('#import').setInputFiles(backupPath!);
  await expect(room.locator('#q-attempt')).toHaveValue('Short futures; margin is refundable.');
  await expect(room.locator('#storage')).toContainText('Backup restored');
  await room.locator('#import').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{}')});
  await expect(room.locator('#storage')).toContainText('not a valid AFM');
  await expect(room.locator('#q-attempt')).toHaveValue('Short futures; margin is refundable.');
});

test(route + ' fits a phone and serves real materials',async({page,request})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(route);
  const room=page.frameLocator('iframe');
  await expect(room.getByRole('button',{name:'Lessons & challenges',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  const frame=page.frames().find(f=>f.url().includes('/afm-classroom/'))!;
  expect(await frame.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  const ppt=await request.get('/afm-classroom/materials/AFM-learning-deck.pptx');
  expect(ppt.ok()).toBeTruthy();expect((await ppt.body()).subarray(0,2).toString()).toBe('PK');
  const paper=await request.get('/afm-classroom/papers/AFM_March_June_2026_Exam_Paper.md');
  expect(await paper.text()).toContain('Pittu');
});

}

test('Classroom 14 uses academy typography and shares progress without restyling Classroom',async({page})=>{
  await page.goto('/classroom-14');
  const room=page.frameLocator('iframe');
  await expect(room.locator('#slide-title')).toBeVisible();
  const frame=page.frames().find(f=>f.url().includes('/afm-classroom/'))!;
  await frame.evaluate(()=>document.fonts.ready);
  const type=await frame.evaluate(()=>({body:getComputedStyle(document.body).fontFamily,heading:getComputedStyle(document.querySelector('h2')!).fontFamily,green:getComputedStyle(document.documentElement).getPropertyValue('--green'),loaded:document.fonts.check('16px "DM Sans"')&&document.fonts.check('28px Anton')}));
  expect(type.body).toContain('DM Sans');expect(type.heading).toContain('Anton');expect(type.green).toBe('#00a347');expect(type.loaded).toBeTruthy();
  await page.screenshot({path:'test-results/classroom14-desktop.png',fullPage:true});
  await room.locator('#lesson-attempt').fill('Shared lesson attempt');
  await room.locator('#lesson-commit').click();
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'test-results/classroom14-mobile.png',fullPage:true});
  await page.goto('/classroom');
  await expect(room.locator('#lesson-attempt')).toHaveValue('Shared lesson attempt');
  await expect(room.locator('link[href="classroom14.css"]')).toHaveCount(0);
});

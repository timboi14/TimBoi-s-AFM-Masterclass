/* ============================================================
   AFM × SPURS — shared state, sound, confetti, coach
   ============================================================ */
const STORAGE_KEY = 'afm_spurs_v2';
const defaultState = {
  name:'',
  points:0,
  streak:0,
  lastDay:'',
  solved:[],
  revealed:[],
  attempted:[],
  weakness:{},      // {topicId: misses}
  notesRead:[],     // [topicId]
  soundOn:true,
  examMockBest:0,
  leaderboard:[]
};
let state = (function load(){
  try{ const s = JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
       return s ? {...defaultState, ...s, weakness:{...(s.weakness||{})}} : {...defaultState}; }
  catch(e){ return {...defaultState}; }
})();
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

/* ---------- LEVELS ---------- */
const LEVELS = [
  {min:0,    name:'Academy'},
  {min:200,  name:'U21 Squad'},
  {min:500,  name:'First Team'},
  {min:1000, name:'Starting XI'},
  {min:1700, name:'Captain'},
  {min:2600, name:'Top Scorer'},
  {min:3800, name:'Spurs Legend'},
];
function levelOf(p){
  let lvl=1, name=LEVELS[0].name, next=LEVELS[1]?.min ?? p;
  for(let i=0;i<LEVELS.length;i++){
    if(p >= LEVELS[i].min){
      lvl=i+1; name=LEVELS[i].name;
      next=LEVELS[i+1]?LEVELS[i+1].min:LEVELS[i].min;
    }
  }
  const prev = LEVELS[lvl-1].min;
  const ratio = next===prev ? 1 : Math.min(1,(p-prev)/(next-prev));
  return {lvl,name,ratio,next};
}

/* ---------- WEB AUDIO ---------- */
let audioCtx=null;
function ac(){ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); return audioCtx; }
function beep(freq=660,dur=0.08,type='sine',vol=0.07){
  if(!state.soundOn) return;
  try{ const c=ac(),o=c.createOscillator(),g=c.createGain();
    o.type=type; o.frequency.value=freq;
    g.gain.setValueAtTime(vol,c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+dur);
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime+dur);
  }catch(e){}
}
function cheer(){
  if(!state.soundOn) return;
  [523,659,784,1047,1318].forEach((f,i)=>setTimeout(()=>beep(f,0.18,'triangle',0.10),i*85));
}
function whistle(){
  if(!state.soundOn) return;
  [880,1320,1760].forEach((f,i)=>setTimeout(()=>beep(f,0.22,'square',0.07),i*70));
}
function chant(){
  if(!state.soundOn) return;
  // little COYS chant motif
  const seq = [392,392,494,494,587,494,392];
  seq.forEach((f,i)=>setTimeout(()=>beep(f,0.16,'sawtooth',0.05),i*140));
}

/* ---------- POINTS / STREAK ---------- */
function award(p,label){
  state.points += p;
  bumpStreak();
  save();
  renderMeters();
  renderLeaderboard();
  toast(`+${p} ${label||'pts'}`, p>=100?'gold':'');
  beep(880,0.07,'triangle',0.06);
}
function bumpStreak(){
  const today = new Date().toISOString().slice(0,10);
  if(state.lastDay === today) return;
  const y = new Date(); y.setDate(y.getDate()-1);
  const yISO = y.toISOString().slice(0,10);
  state.streak = (state.lastDay === yISO) ? state.streak+1 : 1;
  state.lastDay = today;
}

/* ---------- TOAST ---------- */
let toastT;
function toast(text, cls=''){
  let el = document.getElementById('toast');
  if(!el){ // create lazily
    el = document.createElement('div');
    el.id='toast'; el.className='toast';
    el.innerHTML='<i class="fa-solid fa-bolt"></i><span id="toast-text"></span>';
    document.body.appendChild(el);
  }
  document.getElementById('toast-text').textContent = text;
  el.className = 'toast show ' + cls;
  clearTimeout(toastT);
  toastT = setTimeout(()=>{ el.className='toast'; }, 1700);
}

/* ---------- CONFETTI (gold/white, Spurs colours) ---------- */
function confetti(duration=1800){
  let cv = document.getElementById('confetti');
  if(!cv){
    cv = document.createElement('canvas');
    cv.id='confetti'; document.body.appendChild(cv);
  }
  const cx = cv.getContext('2d');
  function fit(){ cv.width = innerWidth; cv.height = innerHeight; }
  fit(); addEventListener('resize', fit, {once:true});
  cv.classList.add('run');
  const N=160;
  const colors = ['#ffd700','#ffffff','#fff8d8','#ffb300','#132257','#19c37d'];
  const parts=[];
  for(let i=0;i<N;i++){
    parts.push({
      x: innerWidth/2 + (Math.random()-0.5)*140,
      y: innerHeight/2 + (Math.random()-0.5)*60,
      vx:(Math.random()-0.5)*10,
      vy:(Math.random()-1)*12,
      g:0.25+Math.random()*0.15,
      s:4+Math.random()*5,
      r:Math.random()*Math.PI,
      vr:(Math.random()-0.5)*0.3,
      c:colors[i%colors.length]
    });
  }
  const t0=performance.now();
  function frame(t){
    const e=t-t0;
    cx.clearRect(0,0,cv.width,cv.height);
    parts.forEach(p=>{
      p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr;
      cx.save(); cx.translate(p.x,p.y); cx.rotate(p.r);
      cx.fillStyle=p.c; cx.fillRect(-p.s/2,-p.s/2,p.s,p.s*0.6);
      cx.restore();
    });
    if(e<duration) requestAnimationFrame(frame);
    else{ cx.clearRect(0,0,cv.width,cv.height); cv.classList.remove('run'); }
  }
  requestAnimationFrame(frame);
  cheer();
}

/* ---------- NAME OVERLAY ---------- */
function maybePromptName(){
  if(state.name) return;
  const ov = document.getElementById('name-overlay');
  if(!ov) return;
  ov.classList.add('show');
  setTimeout(()=> document.getElementById('name-input')?.focus(), 50);
}
function bindNamePrompt(){
  const go = document.getElementById('name-go');
  const input = document.getElementById('name-input');
  if(!go || !input) return;
  go.onclick = ()=>{
    const v=(input.value||'').trim().slice(0,24)||'COYS_Fan';
    state.name = v; bumpStreak(); save();
    document.getElementById('name-overlay').classList.remove('show');
    renderMeters(); renderLeaderboard();
    chant(); toast(`Welcome to White Hart Lane, ${v}!`,'gold');
  };
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') go.click(); });
}

/* ---------- METERS / PROGRESS / LB ---------- */
function renderMeters(){
  const lvl = levelOf(state.points);
  const set = (id,html)=>{ const el=document.getElementById(id); if(el) el.innerHTML=html; };
  set('m-points', state.points);
  set('m-level', `${lvl.lvl}<small>${lvl.name}</small>`);
  set('m-streak', `${state.streak}<small>days</small>`);
  set('m-solved', `${state.solved.length}<small>/${(window.QUESTIONS||[]).length||'?'}</small>`);
  const fill = document.getElementById('progress-fill');
  if(fill) fill.style.width = (lvl.ratio*100).toFixed(0)+'%';
  const lvlTxt = document.getElementById('progress-lvl');
  if(lvlTxt) lvlTxt.textContent = `LVL ${lvl.lvl} · ${lvl.name} · ${(lvl.ratio*100).toFixed(0)}%`;
  const nm = document.getElementById('player-name');
  if(nm) nm.textContent = state.name || 'Set name';
  const st = document.getElementById('sound-toggle');
  if(st) st.innerHTML = state.soundOn
    ? '<i class="fa-solid fa-volume-high"></i> Sound: ON'
    : '<i class="fa-solid fa-volume-xmark"></i> Sound: OFF';
}
function bindSoundToggle(){
  const st = document.getElementById('sound-toggle');
  if(!st) return;
  st.style.cursor='pointer';
  st.onclick = ()=>{ state.soundOn = !state.soundOn; save(); renderMeters(); if(state.soundOn) beep(880,0.1); };
}
function renderLeaderboard(){
  const body = document.getElementById('lb-body');
  if(!body) return;
  const lb = (state.leaderboard||[]).filter(e=> e.name !== state.name);
  if(state.name){
    lb.push({name:state.name, points:state.points, streak:state.streak, solved:state.solved.length});
  }
  lb.sort((a,b)=> b.points-a.points || b.solved-a.solved);
  let top = lb.slice(0,5);
  if(top.length<5){
    const rivals = [
      {name:'HarryK_9', points:1450, streak:9, solved:9},
      {name:'SonHM_7',  points:1180, streak:7, solved:8},
      {name:'Romero_17',points:880,  streak:5, solved:7},
      {name:'Maddison10',points:640, streak:4, solved:6},
      {name:'BissoumaY',points:340,  streak:2, solved:3}
    ];
    rivals.forEach(r=>{ if(top.length<5 && !top.find(x=>x.name===r.name)) top.push(r); });
    top.sort((a,b)=> b.points-a.points || b.solved-a.solved);
    top = top.slice(0,5);
  }
  body.innerHTML = top.map((row,i)=>{
    const cls = i===0?'gold':i===1?'silver':i===2?'bronze':'';
    const me = row.name === state.name ? 'you' : '';
    return `<tr class="${me}">
      <td class="rank ${cls}">${i+1}</td>
      <td>${escapeHTML(row.name)}${me?' <i class="fa-solid fa-star" style="color:var(--gold)"></i>':''}</td>
      <td>${row.points}</td>
      <td>${row.streak}🔥</td>
      <td>${row.solved}</td>
    </tr>`;
  }).join('');
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

/* ---------- COACH (with weak-area awareness) ---------- */
const COACH_TIPS = [
  {weak:'adviser', tip:'<b>Trade-off Theory</b>: balance tax shield vs distress costs. Use the 4Ts (Transfer/Tolerate/Treat/Terminate) — link choice to the firm\'s risk APPETITE.', ref:'Sep/Dec 2024 Q3'},
  {weak:'behav', tip:'For every bias: <b>NAME · EXPLAIN · APPLY</b>. Generic listings cap your marks. In M&A, watch for <b>auction fever, hubris (Roll 1986), and anchoring</b> on the asking price.', ref:'Mar/Jun 2024 Q2'},
  {weak:'coc', tip:'WACC = (E/V)·Ke + (D/V)·Kd·(1−T). Use MARKET values, not book. <b>βa = βe · E/(E+D(1−T))</b> — ungear comparable, regear at YOUR D/E.', ref:'Sep/Dec 2023 Q1'},
  {weak:'fx', tip:'When hedging an FX <b>receipt</b>, BORROW the foreign currency now and DEPOSIT in £. The four MMH steps never change. Bid/offer side: the bank gives you the WORSE rate.', ref:'Sep/Dec 2022 Q2 · Mar/Jun 2024 Q1'},
  {weak:'apv', tip:'APV = Base NPV (at <b>ungeared Ke</b>) + PV of financing side-effects (at the <b>debt rate</b>). NEVER WACC inside APV. Subsidy benefit = saving × (1−T).', ref:'Sep/Dec 2023 Q1'},
  {weak:'real', tip:'<b>Pa</b> = PV of project inflows. <b>Pe</b> = capex. Don\'t flip them. Higher σ → HIGHER option value (counter-intuitive).', ref:'Mar/Jun 2024 Q3'},
  {weak:'mna', tip:'Floor = target stand-alone. Ceiling = stand-alone + synergy − integration. Bid sits between. Comment on cash/share mix and bootstrapping.', ref:'Sep/Dec 2021 Q1'},
  {weak:'npv', tip:'<b>Real cash flows × (1+specific inflation rate)^t = nominal CFs.</b> Then discount at <b>nominal</b> rate. Mixing real & nominal is the #1 marks-loser per Mar/Jun 2024 examiner report.', ref:'Mar/Jun 2023 Q1'},
  {weak:'ir', tip:'Borrowers BUY FRA at OFFER (higher) rate. Settlement on the difference, principal does NOT change hands. Quarterly = ÷4, not ÷365 unless told.', ref:'Sep/Dec 2023 Q2'},
  {weak:'risk', tip:'<b>z(95% one-tail) = 1.645</b>. <b>z(99%) = 2.326</b>. 10-day VaR = 1-day × √10. Always state limitations: fat tails, stable σ assumption, IID failure.', ref:'Mar/Jun 2023 Q3'},
  {weak:'val', tip:'FCFF discounted at WACC → enterprise value. FCFE → equity directly at Ke. Don\'t mix. Iterate WACC if MV equity isn\'t given.', ref:'Sep/Dec 2024 Q2'},
  {weak:'islam', tip:'No <b>riba</b> (interest), no <b>gharar</b> (uncertainty), no <b>maysir</b> (speculation). Sukuk = ASSET-BACKED bond. Mudaraba: losses fall ONLY on the capital provider.', ref:'Sep/Dec 2022 Q3'},
  {weak:'esg', tip:'<b>ESG marks = scenario-specific.</b> Don\'t define ESG. State an issue from the case, recommend a feasible action, link to financial/reputational outcome (Sep/Dec 2025 examiner).', ref:'Sep/Dec 2025'},
  {weak:'app', tip:'Application is everything. Use the COMPANY NAME and SPECIFIC FIGURES from the case. Generic answers fail dramatically.', ref:'TimBoi\'s rule'},
];
function bindCoach(){
  const c = document.getElementById('coach');
  const b = document.getElementById('coach-bubble');
  if(!c) return;
  let bT;
  c.onclick = ()=>{
    // Pick weakness-relevant tip if possible
    const weakTopics = Object.keys(state.weakness||{}).sort((a,b)=> (state.weakness[b]||0)-(state.weakness[a]||0));
    let tip;
    if(weakTopics.length){
      const id = weakTopics[0];
      tip = COACH_TIPS.find(t=> t.weak===id) || COACH_TIPS[Math.floor(Math.random()*COACH_TIPS.length)];
    } else tip = COACH_TIPS[Math.floor(Math.random()*COACH_TIPS.length)];
    b.innerHTML = `
      <div><i class="fa-solid fa-user-graduate" style="color:var(--gold)"></i> <b>Coach TimBoi (the Bench)</b></div>
      <div style="margin-top:6px">${tip.tip}</div>
      <span class="ref">⚽ ${tip.ref}</span>`;
    b.classList.add('show'); beep(540,0.06,'triangle',0.06);
    clearTimeout(bT); bT=setTimeout(()=>b.classList.remove('show'), 9000);
  };
}

/* ---------- NAV ACTIVE ---------- */
function bindNav(){
  const path = location.pathname.split('/').pop().toLowerCase() || 'index.html';
  document.querySelectorAll('.nav-links a, .navlinks a').forEach(a=>{
    const href = (a.getAttribute('href')||'').toLowerCase();
    if(href === path || (href==='index.html' && (path===''||path==='index.html'))){
      a.classList.add('active');
    }
  });
}

/* ---------- BOOT ---------- */
function bootShared(){
  bindNav(); bindNamePrompt(); bindSoundToggle(); bindCoach();
  renderMeters(); renderLeaderboard();
  if(state.name){ bumpStreak(); save(); renderMeters(); }
  // Esc closes any open modal
  addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      document.querySelectorAll('.modal-backdrop.show').forEach(m=>m.classList.remove('show'));
    }
    if((e.key==='c'||e.key==='C') && !document.querySelector('.modal-backdrop.show')){
      document.getElementById('coach')?.click();
    }
  });
  maybePromptName();
}
addEventListener('DOMContentLoaded', bootShared);

/* ---------- TICKER (used on hub) ---------- */
function renderTicker(items){
  const t = document.getElementById('ticker'); if(!t) return;
  const txt = items.map(s=>`<span>● ${s}</span>`).join('');
  t.innerHTML = txt + txt;
}

/* ---------- HELPERS for topic.html ---------- */
function recordWeakness(topicId){
  state.weakness = state.weakness || {};
  state.weakness[topicId] = (state.weakness[topicId]||0) + 1;
  save();
}
function clearWeakness(topicId){
  if(state.weakness && state.weakness[topicId]){
    state.weakness[topicId] = Math.max(0, state.weakness[topicId]-1);
    save();
  }
}

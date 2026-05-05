/* ============================================================
   TimBoi's Academy — Animation engine (vanilla, zero-build)
   Brings framer-motion-grade interactions to plain HTML.
   Auto-bootstraps on DOMContentLoaded. Respects prefers-reduced-motion.
   ============================================================ */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ────────────────── 1) SPOTLIGHT CURSOR on cards ──────────────────
  // Mouse-following radial gradient on every .card.card-padding and .fixture.
  function attachSpotlight(el){
    if(reduce) return;
    if(el.dataset.spotlightAttached) return;
    el.dataset.spotlightAttached = '1';
    el.style.setProperty('--mx','-9999px');
    el.style.setProperty('--my','-9999px');
    el.addEventListener('pointermove', (e)=>{
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      el.style.setProperty('--mo', '1');
    }, {passive:true});
    el.addEventListener('pointerleave', ()=>{
      el.style.setProperty('--mo', '0');
    });
    el.classList.add('has-spotlight');
  }

  // ────────────────── 2) TILT on .fixture cards ──────────────────
  function attachTilt(el){
    if(reduce) return;
    if(el.dataset.tiltAttached) return;
    el.dataset.tiltAttached = '1';
    let raf = 0;
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 280ms cubic-bezier(.2,.8,.2,1), box-shadow 280ms';
    el.style.willChange = 'transform';
    el.addEventListener('pointermove', (e)=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -8;   // tilt up/down
      const ry = (px - 0.5) *  10;  // tilt left/right
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
      });
    }, {passive:true});
    el.addEventListener('pointerleave', ()=>{
      cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  }

  // ────────────────── 3) COUNT-UP numbers ──────────────────
  // Any .stat .value containing only a number gets animated 0→target on first paint
  function countUp(el){
    if(reduce) return;
    const txt = el.textContent.trim();
    const m = txt.match(/^(\d+)/);
    if(!m) return;
    const target = parseInt(m[1],10);
    if(target === 0 || target > 99999) return;
    const suffix = txt.slice(m[1].length);
    const start = performance.now();
    const dur = Math.min(1200, 350 + target * 8);
    const ease = t => 1 - Math.pow(1-t, 3);
    function tick(now){
      const t = Math.min(1, (now - start)/dur);
      el.firstChild.nodeValue = String(Math.round(target * ease(t)));
      // preserve <small> if present
      if(t < 1) requestAnimationFrame(tick);
      else el.firstChild.nodeValue = String(target);
    }
    // Make sure first child is the number text node
    if(el.firstChild && el.firstChild.nodeType === 3){
      requestAnimationFrame(tick);
    }
  }

  // ────────────────── 4) SCROLL REVEAL ──────────────────
  // Fade + slide-up on .section-title, .grid-2 > *, .grid-3 > *, .grid-4 > * on intersection
  function attachScrollReveal(){
    if(reduce) return;
    const sels = ['.section-title','.fixture','.stat','.news-strip','.lb','.qa-card'];
    const all = document.querySelectorAll(sels.join(','));
    if(!('IntersectionObserver' in window)){
      all.forEach(el => el.classList.add('reveal-in'));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((e,i)=>{
        if(e.isIntersecting){
          const idx = Array.from(all).indexOf(e.target);
          e.target.style.transitionDelay = ((idx % 8) * 40) + 'ms';
          e.target.classList.add('reveal-in');
          io.unobserve(e.target);
        }
      });
    }, {threshold: 0.08, rootMargin: '0px 0px -40px 0px'});
    all.forEach(el=>{
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // ────────────────── 5) MAGNETIC buttons ──────────────────
  function attachMagnetic(el){
    if(reduce) return;
    if(el.dataset.magneticAttached) return;
    el.dataset.magneticAttached = '1';
    el.style.transition = 'transform 200ms cubic-bezier(.2,.8,.2,1)';
    el.style.willChange = 'transform';
    el.addEventListener('pointermove', (e)=>{
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width/2)) / (r.width/2);
      const dy = (e.clientY - (r.top + r.height/2)) / (r.height/2);
      el.style.transform = `translate(${(dx*4).toFixed(2)}px, ${(dy*3).toFixed(2)}px)`;
    });
    el.addEventListener('pointerleave', ()=>{ el.style.transform = ''; });
  }

  // ────────────────── 6) SPARKLE BURST on click of .btn-primary ──────────────────
  function sparkle(x, y){
    if(reduce) return;
    const colors = ['hsl(43,96%,56%)','hsl(43,96%,72%)','hsl(220,40%,75%)','hsl(0,0%,100%)'];
    const N = 14;
    for(let i=0;i<N;i++){
      const s = document.createElement('span');
      s.className = 'spark';
      const ang = (Math.PI*2)*(i/N) + Math.random()*0.6;
      const dist = 36 + Math.random()*24;
      const tx = Math.cos(ang)*dist;
      const ty = Math.sin(ang)*dist;
      s.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:6px;height:6px;border-radius:50%;background:${colors[i%colors.length]};pointer-events:none;z-index:9999;--tx:${tx}px;--ty:${ty}px;`;
      document.body.appendChild(s);
      requestAnimationFrame(()=>{ s.classList.add('go'); });
      setTimeout(()=>s.remove(), 700);
    }
  }

  function attachSparkle(){
    if(reduce) return;
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('.btn-primary, .qa-card .qa-q, .ribbon, .crest');
      if(!btn) return;
      const r = btn.getBoundingClientRect();
      sparkle(r.left + r.width/2, r.top + r.height/2);
    });
  }

  // ────────────────── 7) STREAK / POINTS PULSE ──────────────────
  // Watches state.points changes and pulses the meter
  function attachPulse(){
    const el = document.getElementById('m-points');
    if(!el) return;
    let last = parseInt(el.textContent,10) || 0;
    const obs = new MutationObserver(()=>{
      const cur = parseInt(el.textContent,10) || 0;
      if(cur > last){
        el.classList.remove('pulse-up');
        void el.offsetWidth;
        el.classList.add('pulse-up');
      }
      last = cur;
    });
    obs.observe(el, {childList:true, characterData:true, subtree:true});
  }

  // ────────────────── 8) AURORA mouse-follow ──────────────────
  function attachAurora(){
    if(reduce) return;
    const a = document.querySelector('.aurora');
    if(!a) return;
    let raf=0;
    document.addEventListener('pointermove', (e)=>{
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        a.style.setProperty('--ax', x+'%');
        a.style.setProperty('--ay', y+'%');
      });
    }, {passive:true});
  }

  // ────────────────── BOOTSTRAP ──────────────────
  function boot(){
    document.querySelectorAll('.card, .fixture, .stat').forEach(attachSpotlight);
    document.querySelectorAll('.fixture').forEach(attachTilt);
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(attachMagnetic);
    document.querySelectorAll('.stat .value').forEach(countUp);
    attachScrollReveal();
    attachSparkle();
    attachPulse();
    attachAurora();

    // Re-attach when content is dynamically rendered (theory list, fixtures, news)
    const mo = new MutationObserver((muts)=>{
      muts.forEach(m=>{
        m.addedNodes.forEach(n=>{
          if(!(n instanceof HTMLElement)) return;
          if(n.matches?.('.fixture, .card, .stat, .qa-card, .news-strip')) {
            attachSpotlight(n);
            if(n.classList.contains('fixture')) attachTilt(n);
          }
          n.querySelectorAll?.('.fixture').forEach(attachTilt);
          n.querySelectorAll?.('.card, .fixture, .stat').forEach(attachSpotlight);
          n.querySelectorAll?.('.btn-primary, .btn-outline').forEach(attachMagnetic);
        });
      });
    });
    mo.observe(document.body, {childList:true, subtree:true});
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot, {once:true});
  } else {
    boot();
  }
})();

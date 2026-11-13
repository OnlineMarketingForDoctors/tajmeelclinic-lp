/* Tajmeel Clinic, FUE landing page interactions */
(() => {
  'use strict';

  /* ------------------------------------------------------------
     GoHighLevel form connection.
     Paste the GHL inbound webhook URL (Automation > Workflows >
     Inbound Webhook trigger) between the quotes below.
     ------------------------------------------------------------ */
  const GHL_WEBHOOK_URL = '';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header state ---------- */
  const hdr = $('.hdr');
  const toTop = $('.to-top');
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('is-stuck', y > 40);
    toTop.classList.toggle('is-on', y > 900);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  $$('[data-to-top]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }));
  onScroll();

  /* active menu item */
  const navLinks = $$('.hdr__nav a');
  const navTargets = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navTargets.forEach(t => navObs.observe(t));
  }

  /* ---------- Mobile drawer ---------- */
  const drawer = $('#drawer');
  const openBtn = $('[data-menu-open]');
  const openDrawer = () => { drawer.hidden = false; openBtn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; $('a', drawer).focus(); };
  const closeDrawer = () => { drawer.hidden = true; openBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  openBtn.addEventListener('click', openDrawer);
  $('[data-menu-close]').addEventListener('click', closeDrawer);
  drawer.addEventListener('click', e => { if (e.target === drawer || e.target.closest('a')) closeDrawer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });

  /* ---------- Hero mini before & after ---------- */
  const miniImgs = $$('.mini-ba__frames img');
  const miniDots = $$('.mini-ba__dots i');
  let mini = 0;
  if (!reduce && miniImgs.length > 1) {
    setInterval(() => {
      miniImgs[mini].classList.remove('is-on'); miniDots[mini].classList.remove('is-on');
      mini = (mini + 1) % miniImgs.length;
      miniImgs[mini].classList.add('is-on'); miniDots[mini].classList.add('is-on');
    }, 3200);
  }

  /* ---------- Reviews ticker ---------- */
  const GOOGLE_SVG = '<svg class="review__src" viewBox="0 0 48 48" role="img" aria-label="Google review"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 32 15.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 32 15.1l5.7-5.7A20 20 0 0 0 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>';
  const TP_SVG = '<svg class="review__src" viewBox="0 0 24 24" role="img" aria-label="Trustpilot review"><rect width="24" height="24" rx="5" fill="#00B67A"/><path fill="#fff" d="M12 4.6l2.1 6.3h6.6l-5.3 3.9 2 6.3-5.4-3.9-5.4 3.9 2-6.3-5.3-3.9h6.6z"/></svg>';

  const ticker = $('[data-ticker]');
  const track = $('.ticker__track', ticker);
  const cards = $$('.review', track);
  cards.forEach(c => c.insertAdjacentHTML('afterbegin', c.dataset.src === 'google' ? GOOGLE_SVG : TP_SVG));

  const addReadMore = card => {
    const text = $('.review__text', card);
    if (text.scrollHeight > text.clientHeight + 4) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'review__more'; b.textContent = 'Read more';
      b.setAttribute('aria-expanded', 'false');
      b.addEventListener('click', () => {
        const open = card.classList.toggle('is-open');
        b.textContent = open ? 'Show less' : 'Read more';
        b.setAttribute('aria-expanded', String(open));
        ticker.classList.toggle('is-paused', !!$('.review.is-open', track));
      });
      card.appendChild(b);
    }
  };
  cards.forEach(addReadMore);
  /* duplicate the set so the loop is seamless */
  cards.forEach(c => {
    const clone = c.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('button', clone).forEach(b => b.remove());
    clone.classList.remove('is-open');
    addReadMoreClone(clone);
    track.appendChild(clone);
  });
  function addReadMoreClone(clone) {
    requestAnimationFrame(() => {
      addReadMore(clone);
      $$('button', clone).forEach(b => b.setAttribute('tabindex', '-1'));
    });
  }
  track.style.setProperty('--dur', cards.length * 8 + 's');

  /* ---------- Before & After slider ---------- */
  const CASES = [
    { id: 1, title: '40 year old man, 4,390 grafts', text: 'Extensive frontal and mid-scalp loss restored with FUE and DHI. Photo taken 10 months after surgery.' },
    { id: 2, title: '33 year old man, 1,990 grafts', text: 'Receding hairline rebuilt to frame the face. Photo taken 12 months after surgery.' },
    { id: 3, title: '36 year old man, 2,430 grafts', text: 'Thinning across the front and temples restored. Photo taken 6 months after surgery.' },
    { id: 5, title: 'Frontal hairline restoration', text: 'A sparse, receding front filled in with a soft, natural hairline using FUE.' },
    { id: 6, title: 'Hairline lowered and refined', text: 'A high forehead brought forward with a hairline designed around the patient’s features.' },
    { id: 7, title: 'Thinning front and temples', text: 'Diffuse thinning at the front treated with FUE for fuller, even density.' },
    { id: 8, title: 'Top of the scalp restored', text: 'Advanced loss on top treated with FUE, giving back density that can be styled.' },
    { id: 9, title: 'Full hairline reconstruction', text: 'A new hairline drawn and restored with FUE after significant frontal loss.' }
  ];
  const baTrack = $('[data-ba-track]');
  const knobSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l-5 6 5 6M15 6l5 6-5 6"/></svg>';
  baTrack.innerHTML = CASES.map((c, i) => `
    <figure class="ba-card">
      <div class="compare" style="--pos:50%">
        <img src="img/ba/case-${c.id}-before.webp" alt="Before FUE hair transplant: ${c.title}" width="400" height="455" loading="lazy">
        <img class="compare__after" src="img/ba/case-${c.id}-after.webp" alt="After FUE hair transplant: ${c.title}" width="400" height="455" loading="lazy">
        <span class="compare__tag compare__tag--b">Before</span>
        <span class="compare__tag compare__tag--a">After</span>
        <input type="range" min="0" max="100" value="50" aria-label="Reveal the after photo for patient ${i + 1}">
        <span class="compare__handle"><span class="compare__knob">${knobSvg}</span></span>
      </div>
      <figcaption><strong>${c.title}</strong><span>${c.text}</span></figcaption>
    </figure>`).join('');

  $$('.compare', baTrack).forEach(cmp => {
    const range = $('input', cmp);
    const set = v => cmp.style.setProperty('--pos', v + '%');
    range.addEventListener('input', () => set(range.value));
    range.addEventListener('pointerdown', () => cmp.classList.add('is-drag'));
    window.addEventListener('pointerup', () => cmp.classList.remove('is-drag'));
  });

  /* nudge the first visible sliders once so people see they move */
  const nudge = cmp => {
    if (reduce) return;
    const range = $('input', cmp);
    const frames = [50, 32, 68, 50];
    let i = 0;
    const step = () => { cmp.style.transition = 'none'; range.value = frames[i]; cmp.style.setProperty('--pos', frames[i] + '%'); if (++i < frames.length) setTimeout(step, 420); };
    step();
  };

  let baIndex = 0;
  const baPrev = $('[data-ba-prev]'), baNext = $('[data-ba-next]');
  const perView = () => (window.innerWidth <= 899 ? 1 : window.innerWidth <= 1100 ? 2 : 3);
  const baUpdate = () => {
    const max = CASES.length - perView();
    baIndex = Math.max(0, Math.min(baIndex, max));
    const card = $('.ba-card', baTrack);
    const gap = parseFloat(getComputedStyle(baTrack).gap) || 0;
    if (window.innerWidth > 560) baTrack.style.transform = `translateX(${-baIndex * (card.offsetWidth + gap)}px)`;
    baPrev.disabled = baIndex === 0; baNext.disabled = baIndex >= max;
  };
  baPrev.addEventListener('click', () => { baIndex -= perView(); baUpdate(); });
  baNext.addEventListener('click', () => { baIndex += perView(); baUpdate(); });
  window.addEventListener('resize', baUpdate);
  baUpdate();

  /* ---------- Journey track ---------- */
  const jTrack = $('[data-j-track]');
  const jBar = $('[data-j-progress]');
  const jStep = () => ($('.step', jTrack).offsetWidth + 24);
  $('[data-j-prev]').addEventListener('click', () => jTrack.scrollBy({ left: -jStep(), behavior: 'smooth' }));
  $('[data-j-next]').addEventListener('click', () => jTrack.scrollBy({ left: jStep(), behavior: 'smooth' }));
  const jProgress = () => {
    const max = jTrack.scrollWidth - jTrack.clientWidth;
    const p = max > 0 ? jTrack.scrollLeft / max : 1;
    jBar.style.width = (18 + p * 82) + '%';
  };
  jTrack.addEventListener('scroll', jProgress, { passive: true });
  jProgress();

  /* ---------- One-off reveals ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('is-in');
        if (el.classList.contains('ba')) $$('.compare', el).slice(0, perView()).forEach((c, i) => setTimeout(() => nudge(c), 300 + i * 250));
        obs.unobserve(el);
      });
    }, { threshold: .25 });
    $$('.growth, .ba').forEach(el => io.observe(el));
    $$('.intro__main, .benefits__main, .doctor__main').forEach(el => { el.classList.add('reveal-img'); io.observe(el); });
  }

  /* ---------- Gentle parallax on satellite images ---------- */
  const para = $$('.parallax');
  if (!reduce && para.length && window.innerWidth > 899) {
    let ticking = false;
    const run = () => {
      const vh = window.innerHeight;
      para.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const d = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed || 0);
        el.style.transform = `translate3d(0, ${d.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }

  /* ---------- Price estimator ---------- */
  const grafts = $('#grafts'), gOut = $('#graft-out'), pOut = $('#price-out');
  const fmt = n => n.toLocaleString('en-GB');
  const calc = () => {
    const g = +grafts.value;
    const price = 3500 + Math.max(0, g - 1000) * 2.5;
    gOut.textContent = fmt(g);
    pOut.textContent = '£' + fmt(Math.round(price));
    grafts.style.setProperty('--p', ((g - grafts.min) / (grafts.max - grafts.min) * 100) + '%');
  };
  grafts.addEventListener('input', calc);
  calc();

  /* ---------- Video modal ---------- */
  const modal = $('#video-modal');
  const video = $('video', modal);
  const loop = $('.hero__video video');
  if (reduce && loop) { loop.removeAttribute('autoplay'); loop.pause(); }
  $('[data-video]').addEventListener('click', () => { if (loop) loop.pause(); modal.showModal(); video.play().catch(() => {}); });
  const closeVideo = () => { video.pause(); modal.close(); };
  $('[data-video-close]').addEventListener('click', closeVideo);
  modal.addEventListener('click', e => { if (e.target === modal) closeVideo(); });
  modal.addEventListener('close', () => { video.pause(); if (loop && !reduce) loop.play().catch(() => {}); });

  /* ---------- Booking form (GoHighLevel) ---------- */
  const form = $('#booking-form');
  const status = $('.form__status', form);
  const setStatus = (msg, type) => { status.textContent = msg; status.className = 'form__status ' + (type ? 'is-' + type : ''); };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.company.value) return; /* spam trap */
    let firstBad = null;
    $$('[required]', form).forEach(f => {
      const bad = f.type === 'checkbox' ? !f.checked : !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('is-invalid', bad);
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) {
      setStatus('Please fill in the highlighted fields so we can contact you.', 'error');
      firstBad.focus();
      return;
    }
    if (!GHL_WEBHOOK_URL) {
      setStatus('Online booking is being set up. Please call 01202 002203 to book your consultation.', 'error');
      return;
    }
    const btn = $('button[type=submit]', form);
    btn.disabled = true; btn.textContent = 'Sending your request';
    const data = Object.fromEntries(new FormData(form));
    delete data.company;
    Object.assign(data, {
      full_name: `${data.first_name} ${data.last_name}`.trim(),
      treatment: 'FUE Hair Transplant',
      page_url: location.href,
      submitted_at: new Date().toISOString()
    });
    new URLSearchParams(location.search).forEach((v, k) => { if (/^(utm_|gclid|fbclid)/.test(k)) data[k] = v; });
    try {
      const res = await fetch(GHL_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(res.status);
      form.classList.add('is-sent');
      setStatus('Thank you. Your consultation request has been sent and our team will be in touch shortly.', 'ok');
      window.dataLayer && window.dataLayer.push({ event: 'generate_lead', form: 'fue_consultation' });
    } catch (err) {
      btn.disabled = false; btn.textContent = 'Request my consultation';
      setStatus('Your request did not send. Please try again, or call us on 01202 002203.', 'error');
    }
  });
  $$('input, select, textarea', form).forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();

/**
 * OVCAPP — main.js
 */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── 1. NAV ── */
  const nav       = $('#nav');
  const navToggle = $('#navToggle');
  const navMenu   = $('#navMenu');
  const navLinks  = $$('.nav-links a');

  function onScroll () { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu () {
    navMenu.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu () {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => navMenu.classList.contains('open') ? closeMenu() : openMenu());
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
  });

  /* ── 2. SCROLL REVEAL ── */
  const revealEls = $$('.reveal');

  function showEl(el) { el.classList.add('visible'); }

  // Safety: show everything after 800ms no matter what
  const safetyTimer = setTimeout(() => revealEls.forEach(showEl), 800);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = $$('.reveal', entry.target.parentElement);
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => showEl(entry.target), Math.min(idx * 80, 400));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px' });

    revealEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        showEl(el); // already in viewport
      } else {
        observer.observe(el);
      }
    });
  } else {
    revealEls.forEach(showEl);
  }

  /* ── 3. FEATURE ITEMS ── */
  const featureItems = $$('.feature-item');
  featureItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      featureItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
    item.addEventListener('focus', () => {
      featureItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  /* ── 4. SCROLL SPY ── */
  const sections = $$('section[id]').filter(el =>
    ['inicio','por-que','funciones','planes','nosotros','registro'].includes(el.id)
  );

  function updateActiveLink () {
    const scrollY = window.scrollY + 100;
    let current = '';
    sections.forEach(sec => { if (sec.offsetTop <= scrollY) current = sec.id; });
    navLinks.forEach(link => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active-link');
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── 5. BAR CHART ── */
  const bars = $$('.bar');
  if (bars.length && 'IntersectionObserver' in window) {
    bars.forEach(bar => {
      bar.dataset.targetH = getComputedStyle(bar).getPropertyValue('--h').trim() || '50%';
      bar.style.setProperty('--h', '0%');
    });
    const barObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        bars.forEach((bar, i) => setTimeout(() => bar.style.setProperty('--h', bar.dataset.targetH), i * 60));
        barObserver.disconnect();
      }
    }, { threshold: 0.4 });
    const target = bars[0].closest('.features-visual') || bars[0];
    barObserver.observe(target);
  }

})();

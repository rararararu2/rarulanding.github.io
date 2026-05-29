/* =============================================
   PORTFOLIO — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------
     LOADING SCREEN
  ----------------------------------------------- */
  const loader     = document.getElementById('loader');
  const loaderFill = document.querySelector('.loader-bar__fill');
  const loaderStatus = document.getElementById('loaderStatus');

  const loadSteps = [
    { pct: 20,  msg: 'loading assets...' },
    { pct: 50,  msg: 'building interface...' },
    { pct: 75,  msg: 'almost ready...' },
    { pct: 100, msg: 'welcome.' },
  ];

  let stepIndex = 0;
  function runLoader() {
    if (stepIndex >= loadSteps.length) {
      setTimeout(() => loader.classList.add('hidden'), 420);
      return;
    }
    const step = loadSteps[stepIndex++];
    loaderFill.style.width = step.pct + '%';
    loaderStatus.textContent = step.msg;
    const delay = stepIndex === loadSteps.length ? 420 : 380 + Math.random() * 220;
    setTimeout(runLoader, delay);
  }
  setTimeout(runLoader, 200);

  /* -----------------------------------------------
     THEME TOGGLE
  ----------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') document.body.classList.add('light-mode');

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  });

  /* -----------------------------------------------
     NAV — scroll state + mobile toggle
  ----------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* -----------------------------------------------
     HERO — typewriter
  ----------------------------------------------- */
  const titles = [
    'IT Graduate & Developer',
    'Web Developer & Automator',
    'AI-Integrated Engineer',
  ];

  const typedEl = document.getElementById('typed-title');
  let tIndex = 0, cIndex = 0, deleting = false;

  function type() {
    const current = titles[tIndex];
    if (!deleting) {
      typedEl.textContent = current.slice(0, cIndex + 1);
      cIndex++;
      if (cIndex === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, cIndex - 1);
      cIndex--;
      if (cIndex === 0) {
        deleting = false;
        tIndex = (tIndex + 1) % titles.length;
      }
    }
    setTimeout(type, deleting ? 38 : 78);
  }

  setTimeout(type, 1300);

  /* -----------------------------------------------
     HERO — floating particles
  ----------------------------------------------- */
  const particleContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 18;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1.5;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      --dur: ${Math.random() * 6 + 5}s;
      --delay: ${Math.random() * 8}s;
    `;
    particleContainer.appendChild(p);
  }

  /* -----------------------------------------------
     COUNTER ANIMATION — reusable utility
  ----------------------------------------------- */
  function animateCount(el, target, duration = 1200) {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* -----------------------------------------------
     HERO STATS — animate on load
  ----------------------------------------------- */
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => animateCount(document.getElementById('langCount'), 6, 1000), 900);
        setTimeout(() => animateCount(document.getElementById('techCount'), 4, 1000), 1000);
        setTimeout(() => animateCount(document.getElementById('toolCount'), 4, 1000), 1100);
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

  /* -----------------------------------------------
     SKILL GROUPS — fade in on scroll
  ----------------------------------------------- */
  const skillGroups = document.querySelectorAll('.skill-group[data-animate]');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 120);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  skillGroups.forEach(g => skillObserver.observe(g));

  /* -----------------------------------------------
     EFFICIENCY MATRIX — counters on scroll
  ----------------------------------------------- */
  const matrixTargets = [
    { id: 'm1', val: 85 },
    { id: 'm2', val: 90 },
    { id: 'm3', val: 14 },
    { id: 'm4', val: 95 },
  ];

  const efficiencySection = document.getElementById('efficiency');

  const effObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        matrixTargets.forEach((t, i) => {
          const el = document.getElementById(t.id);
          if (el) setTimeout(() => animateCount(el, t.val, 1400), i * 100);
        });
        effObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  if (efficiencySection) effObserver.observe(efficiencySection);

  /* -----------------------------------------------
     SMOOTH ACTIVE NAV on scroll
  ----------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-links a');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => activeObserver.observe(s));

});

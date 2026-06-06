/* ============================================================
   PRIME DENTAL CONCEPT — script.js
   ============================================================ */

'use strict';

/* ---- PRELOADER ---- */
function initPreloader() {
  const el = document.getElementById('preloader');
  if (!el) return;
  setTimeout(() => { el.classList.add('hidden'); }, 2800);
}

/* ---- SCROLL PROGRESS ---- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ---- STICKY HEADER ---- */
function initHeader() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close nav on link click
  nav?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        activeLink?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => obs.observe(s));
}

/* ---- PARTICLE CANVAS ---- */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(70, Math.floor(W / 18));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        op: Math.random() * 0.45 + 0.1,
        color: Math.random() > 0.5 ? '56,189,248' : '167,243,255'
      });
    }
  }

  let raf;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.op})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(56,189,248,${(1 - d / 130) * 0.25})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    raf = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); createParticles(); }, 200);
  });
}

/* ---- PARALLAX ON MOUSE ---- */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const targets = hero.querySelectorAll('[data-parallax]');
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    targets.forEach(t => {
      const factor = parseFloat(t.dataset.parallax || 0.05);
      t.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    targets.forEach(t => { t.style.transform = ''; });
  });
}

/* ---- SCROLL REVEAL ---- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

/* ---- COUNTERS ---- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();
        obs.unobserve(el);
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target).toLocaleString('pt-BR');
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

/* ---- 3D TILT ON CARDS ---- */
function initTilt() {
  const cards = document.querySelectorAll('.mc-card, .team-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${cx * 8}deg) rotateX(${-cy * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- TESTIMONIALS CAROUSEL ---- */
function initCarousel() {
  const carousel = document.getElementById('tcarousel');
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.tcard');
  const dotsWrap = document.getElementById('tcDots');
  const btnPrev = document.getElementById('tcPrev');
  const btnNext = document.getElementById('tcNext');
  if (!cards.length) return;

  let current = 0;
  let autoplay;
  const perView = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const total = Math.ceil(cards.length / perView());
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'tc-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(idx) {
    const pv = perView();
    const maxIdx = Math.max(0, Math.ceil(cards.length / pv) - 1);
    current = Math.max(0, Math.min(idx, maxIdx));
    const cardWidth = cards[0].offsetWidth + 28; // gap
    carousel.style.transform = `translateX(-${current * pv * cardWidth}px)`;
    dotsWrap?.querySelectorAll('.tc-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); if (current >= Math.ceil(cards.length / perView()) - 1) current = -1; }
  function prev() { goTo(current - 1); }

  btnPrev?.addEventListener('click', prev);
  btnNext?.addEventListener('click', next);

  function startAuto() {
    clearInterval(autoplay);
    autoplay = setInterval(() => { current >= Math.ceil(cards.length / perView()) - 1 ? goTo(0) : next(); }, 5000);
  }

  carousel.closest('.tcarousel-wrap')?.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel.closest('.tcarousel-wrap')?.addEventListener('mouseleave', startAuto);

  buildDots();
  startAuto();
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  // Touch support
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  }, { passive: true });
}

/* ---- RESULTS FILTER ---- */
function initResultsFilter() {
  const tabs = document.querySelectorAll('.rtab');
  const items = document.querySelectorAll('.rg-item');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      items.forEach(item => {
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else {
          const cats = item.dataset.category?.split(' ') || [];
          item.classList.toggle('hidden', !cats.includes(filter));
        }
      });
    });
  });
}

/* ---- RESULT MODAL ---- */
function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const box = document.getElementById('modalBox');
  const content = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay) return;

  function openModal(item) {
    const img = item.querySelector('img');
    const title = item.dataset.modalTitle || '';
    const desc = item.dataset.modalDesc || '';
    const tag = item.querySelector('.rg-tag')?.textContent || '';
    content.innerHTML = `
      <img src="${img?.src || ''}" alt="${title}" loading="lazy">
      <span style="display:inline-block;margin-bottom:10px;font-size:.72rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--blue-light)">${tag}</span>
      <h3>${title}</h3>
      <p>${desc}</p>
      <a href="#agendamento" class="btn btn-primary" onclick="closeModal()"><i class="fab fa-whatsapp"></i> Agendar avaliação</a>
    `;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeModal = function() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.rg-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(btn.closest('.rg-item'));
    });
  });

  document.querySelectorAll('.rg-item').forEach(item => {
    item.addEventListener('click', () => openModal(item));
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ---- FAQ ACCORDION ---- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Open clicked if it wasn't open
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ---- WHATSAPP FORM ---- */
function initWhatsAppForm() {
  const form = document.getElementById('whatsappForm');
  if (!form) return;
  const PHONE = '5500000000000'; // Substitua pelo número real

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.querySelector('[name="nome"]')?.value.trim();
    const tel = form.querySelector('[name="telefone"]')?.value.trim();
    const trat = form.querySelector('[name="tratamento"]')?.value;
    const msg = form.querySelector('[name="mensagem"]')?.value.trim();

    if (!nome || !tel) {
      alert('Por favor, preencha seu nome e telefone para continuar.');
      return;
    }

    let text = `Olá! Vim pelo site da Prime Dental Concept.\n\n`;
    text += `*Nome:* ${nome}\n`;
    text += `*Telefone:* ${tel}\n`;
    if (trat) text += `*Tratamento de interesse:* ${trat}\n`;
    if (msg) text += `*Mensagem:* ${msg}`;

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });
}

/* ---- WHATSAPP FLOAT TOOLTIP ---- */
function initWappFloat() {
  const closeBtn = document.getElementById('wappCloseTip');
  const tooltip = document.getElementById('wappTooltip');
  if (!closeBtn || !tooltip) return;

  // Hide tooltip on mobile automatically
  if (window.innerWidth < 768) {
    tooltip.style.display = 'none';
  }

  closeBtn.addEventListener('click', () => {
    tooltip.style.display = 'none';
    sessionStorage.setItem('wappTooltipClosed', '1');
  });

  if (sessionStorage.getItem('wappTooltipClosed')) {
    tooltip.style.display = 'none';
  }
}

/* ---- SMOOTH SCROLL ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---- CARD HOVER SHIMMER ---- */
function initShimmer() {
  const cards = document.querySelectorAll('.treat-card, .purpose-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

/* ---- BACK TO TOP SHORTCUT ---- */
function initScrollIndicator() {
  // Clicking logo scrolls to top
  document.querySelector('.logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgress();
  initHeader();
  initParticles();
  initParallax();
  initReveal();
  initCounters();
  initTilt();
  initCarousel();
  initResultsFilter();
  initModal();
  initFAQ();
  initWhatsAppForm();
  initWappFloat();
  initSmoothScroll();
  initShimmer();
  initScrollIndicator();

  // Trigger initial scroll events
  window.dispatchEvent(new Event('scroll'));
});

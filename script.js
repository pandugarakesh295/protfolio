/* ═══════════════════════════════════════════════════
   RAKESH PANDUGA — PORTFOLIO  |  script.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── Particle Canvas ──────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.a  = Math.random() * 0.5 + 0.1;
    this.col = Math.random() > 0.5
      ? `rgba(0,198,255,${this.a})`
      : `rgba(123,47,247,${this.a})`;
  };
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };
  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.col;
    ctx.fill();
  };

  function connect() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.15;
          ctx.strokeStyle = `rgba(0,198,255,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    const count = Math.floor((W * H) / 12000);
    particles = Array.from({ length: count }, () => new Particle());
    loop();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
  });
  init();
})();

/* ── Navbar Scroll ────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile Hamburger ─────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = ''; s.style.opacity = '';
    });
  });
});

/* ── Active Nav Link on Scroll ────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links .nav-link');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 100;
  sections.forEach(sec => {
    if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
      navItems.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { passive: true });

/* ── Typewriter ───────────────────────────────────── */
(function initTypewriter() {
  const el    = document.getElementById('typewriter-text');
  const words = [
    'ML Models',
    'Data Pipelines',
    'Insight Dashboards',
    'Full-Stack Apps',
    'Predictive Systems',
    'Smart Solutions',
  ];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word    = words[wi];
    const current = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    el.textContent = current;

    let speed = deleting ? 60 : 100;

    if (!deleting && current === word) {
      speed = 1800;
      deleting = true;
    } else if (deleting && current === '') {
      deleting = false;
      wi = (wi + 1) % words.length;
      speed = 300;
    }
    setTimeout(type, speed);
  }
  type();
})();

/* ── Scroll Reveal ────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Counter Animation ────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num[data-target]');
      nums.forEach(num => animateCounter(num, +num.dataset.target));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

/* ── Score Bar Animation ──────────────────────────── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.score-bar').forEach(bar => barObserver.observe(bar));

/* ── Smooth Section Entrance (stagger cards) ──────── */
const cardGroups = document.querySelectorAll(
  '.about-cards, .timeline, .projects-grid, .skills-grid, .certs-grid, .contact-links'
);
cardGroups.forEach(group => {
  const children = group.querySelectorAll('.glass-card, .timeline-item');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.07}s`;
  });
});

/* ── Cursor Glow ──────────────────────────────────── */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle, rgba(0,198,255,0.06) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.08s, top 0.08s;
    left:-999px; top:-999px;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

/* ── Section Tag Counter Animation ───────────────── */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 25px 70px rgba(0, 198, 255, 0.12)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

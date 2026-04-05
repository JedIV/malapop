// ===== MALAPOP - Main JS =====

// =============================================
// PSYCHEDELIC INTRO
// =============================================

(function initIntro() {
  const overlay = document.getElementById('intro-overlay');
  const canvas = document.getElementById('psyche-canvas');
  const ctx = canvas.getContext('2d');
  const video = document.getElementById('intro-video');
  const wordmark = document.getElementById('intro-wordmark');
  const enterWrap = document.getElementById('intro-enter');
  const btnEnter = document.getElementById('btn-enter');
  const clouds = document.querySelectorAll('.intro-cloud');

  let animFrame;
  let startTime = Date.now();

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Psychedelic background renderer
  function drawPsychedelic(t) {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Dark base
    ctx.fillStyle = 'rgba(26, 10, 10, 0.15)';
    ctx.fillRect(0, 0, w, h);

    const time = t * 0.001;

    // Swirling radial rings
    for (let i = 0; i < 8; i++) {
      const radius = 80 + i * 60 + Math.sin(time * 0.7 + i * 0.5) * 40;
      const hue = (time * 30 + i * 35) % 360;
      const x = cx + Math.cos(time * 0.3 + i * 0.8) * 50;
      const y = cy + Math.sin(time * 0.4 + i * 0.6) * 40;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 80%, 55%, ${0.15 - i * 0.015})`;
      ctx.lineWidth = 3 + Math.sin(time + i) * 2;
      ctx.stroke();
    }

    // Morphing blob shapes
    for (let b = 0; b < 5; b++) {
      const bx = cx + Math.cos(time * 0.5 + b * 1.3) * (w * 0.25);
      const by = cy + Math.sin(time * 0.4 + b * 1.7) * (h * 0.2);
      const bRadius = 40 + Math.sin(time * 0.8 + b) * 25;
      const hue = (time * 25 + b * 60 + 10) % 360;

      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, bRadius * 2.5);
      grad.addColorStop(0, `hsla(${hue}, 90%, 50%, 0.2)`);
      grad.addColorStop(0.5, `hsla(${(hue + 40) % 360}, 80%, 40%, 0.08)`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, bRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spiraling particles
    for (let p = 0; p < 30; p++) {
      const angle = time * 0.5 + p * 0.22;
      const dist = 50 + p * 12 + Math.sin(time * 2 + p) * 20;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const size = 2 + Math.sin(time * 3 + p * 0.5) * 1.5;
      const hue = (time * 40 + p * 12) % 360;

      ctx.fillStyle = `hsla(${hue}, 85%, 65%, ${0.5 + Math.sin(time * 2 + p) * 0.3})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pulsing center glow
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 250 + Math.sin(time) * 50);
    const centerHue = (time * 20) % 360;
    centerGrad.addColorStop(0, `hsla(${centerHue}, 70%, 50%, 0.12)`);
    centerGrad.addColorStop(0.4, `hsla(${(centerHue + 30) % 360}, 60%, 40%, 0.05)`);
    centerGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = centerGrad;
    ctx.fillRect(0, 0, w, h);
  }

  function animate() {
    const elapsed = Date.now() - startTime;
    drawPsychedelic(elapsed);
    animFrame = requestAnimationFrame(animate);
  }

  // Start the intro sequence
  animate();

  // Activate floating clouds with stagger
  clouds.forEach((cloud, i) => {
    setTimeout(() => cloud.classList.add('active'), 300 + i * 200);
  });

  // Play video and show wordmark
  setTimeout(() => {
    video.play().catch(() => {});
  }, 400);

  setTimeout(() => {
    wordmark.classList.add('visible');
  }, 1200);

  setTimeout(() => {
    enterWrap.classList.add('visible');
  }, 2500);

  // Enter button
  btnEnter.addEventListener('click', exitIntro);

  // Also allow spacebar or enter to skip
  function onKeyDown(e) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      exitIntro();
    }
  }
  document.addEventListener('keydown', onKeyDown);

  function exitIntro() {
    document.removeEventListener('keydown', onKeyDown);
    cancelAnimationFrame(animFrame);

    overlay.classList.add('exiting');
    document.body.classList.remove('intro-active');

    setTimeout(() => {
      overlay.classList.add('hidden');
      video.pause();
    }, 900);
  }
})();


// =============================================
// MAIN SITE
// =============================================

// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });
}

// Scroll reveal
const reveals = document.querySelectorAll(
  '.about-text, .about-visual, .founder-section, .flavor-card, .merch-card, .find-card'
);

reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.closest('.flavor-cards, .merch-grid, .find-us-grid')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
          : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach(el => observer.observe(el));

// Nav background on scroll
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 100) {
    nav.style.background = 'rgba(26, 10, 10, 0.95)';
  } else {
    nav.style.background = 'rgba(26, 10, 10, 0.85)';
  }
}, { passive: true });

// Merch card hover wobble
document.querySelectorAll('.merch-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.animation = 'shake 0.4s ease-in-out';
  });
  card.addEventListener('animationend', () => {
    card.style.animation = '';
  });
});

// Easter egg: click the hero cloud to spin it
const heroCloud = document.querySelector('.hero-cloud');
if (heroCloud) {
  heroCloud.addEventListener('click', () => {
    heroCloud.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    heroCloud.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
      heroCloud.style.transition = '';
      heroCloud.style.transform = '';
    }, 700);
  });
}

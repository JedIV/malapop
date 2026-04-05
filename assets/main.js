// ===== MALAPOP - Main JS =====

// =============================================
// POPCORN KERNEL BACKGROUND
// Kernels float gently. Mouse proximity pops them
// into the cloud logo shape. Muted & ambient.
// =============================================

(function kernelBackground() {
  const canvas = document.getElementById('kernel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let mouse = { x: -9999, y: -9999 };
  const POP_RADIUS = 100;      // how close the cursor needs to be
  const KERNEL_COUNT = 80;
  const kernels = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Track mouse in viewport coordinates (canvas is fixed)
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  // ---- Draw helpers ----

  // Unpopped kernel: a small teardrop / oval
  function drawKernel(x, y, size, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#D4A054';
    ctx.beginPath();
    // Teardrop-ish shape
    ctx.ellipse(0, 0, size * 0.5, size * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    // Darker crease
    ctx.fillStyle = '#B8863A';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.15, size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Popped kernel: simplified cloud logo shape
  function drawCloud(x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#E9A825';
    ctx.lineWidth = 1.8;
    ctx.fillStyle = 'rgba(233, 168, 37, 0.12)';

    const s = size * 0.8;

    ctx.beginPath();
    // Big circle (top right of cloud)
    ctx.arc(s * 0.3, -s * 0.15, s * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    // Medium circle (left)
    ctx.arc(-s * 0.25, s * 0.1, s * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    // Small circle (bottom)
    ctx.arc(s * 0.1, s * 0.35, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Small swirl hints
    ctx.beginPath();
    ctx.arc(s * 0.35, s * 0.05, s * 0.12, 0.5, Math.PI * 1.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-s * 0.15, s * 0.2, s * 0.08, 0, Math.PI * 1.3);
    ctx.stroke();

    ctx.restore();
  }

  // ---- Kernel objects ----

  function createKernel() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      size: 5 + Math.random() * 6,
      baseAlpha: 0.25 + Math.random() * 0.15,  // visible but still muted
      rotation: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.5) * 0.15,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      pop: 0,           // 0 = kernel, 1 = fully popped cloud
      popTarget: 0,
      popSize: 22 + Math.random() * 14,  // cloud size when popped
      wobble: Math.random() * Math.PI * 2,
    };
  }

  for (let i = 0; i < KERNEL_COUNT; i++) {
    kernels.push(createKernel());
  }

  // ---- Animation loop ----

  function animate() {
    ctx.clearRect(0, 0, W, H);

    for (const k of kernels) {
      // Gentle drift
      k.wobble += 0.015;
      k.x += k.driftX + Math.sin(k.wobble) * 0.1;
      k.y += k.driftY + Math.cos(k.wobble * 0.7) * 0.08;
      k.rotation += k.rotSpeed;

      // Wrap around viewport
      if (k.y < -30) k.y = H + 30;
      if (k.y > H + 30) k.y = -30;
      if (k.x < -30) k.x = W + 30;
      if (k.x > W + 30) k.x = -30;

      // Distance to mouse (page coordinates)
      const dx = k.x - mouse.x;
      const dy = k.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Pop when cursor is close
      k.popTarget = dist < POP_RADIUS ? 1 : 0;

      // Smooth interpolation
      k.pop += (k.popTarget - k.pop) * 0.08;

      // Draw
      if (k.pop < 0.3) {
        // Mostly kernel
        drawKernel(k.x, k.y, k.size, k.baseAlpha * (1 - k.pop * 0.5), k.rotation);
      } else if (k.pop > 0.7) {
        // Mostly cloud
        drawCloud(k.x, k.y, k.popSize * k.pop, k.baseAlpha * 2 * k.pop);
      } else {
        // Transition: scale up kernel, fade
        const t = (k.pop - 0.3) / 0.4;
        const scale = 1 + t * 1.5;
        drawKernel(k.x, k.y, k.size * scale, k.baseAlpha * (1 - t) * 0.7, k.rotation);
        drawCloud(k.x, k.y, k.popSize * t, k.baseAlpha * t * 1.8);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
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

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });
}

// Scroll reveal
const reveals = document.querySelectorAll(
  '.about-text, .about-visual, .flavor-card, .merch-card, .find-card'
);

reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger the animation slightly for grid items
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
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 100) {
    nav.style.background = 'rgba(26, 10, 10, 0.95)';
  } else {
    nav.style.background = 'rgba(26, 10, 10, 0.85)';
  }

  lastScroll = scrollY;
}, { passive: true });

// Fun hover wobble on merch cards
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

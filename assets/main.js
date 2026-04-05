// ===== MALAPOP - Main JS =====

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

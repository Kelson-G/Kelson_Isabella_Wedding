/* ============================================
   main.js — Shared JS
   Kelson & Isabella Wedding
   ============================================ */

// Mark active nav link based on current page
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
})();

// Hamburger nav toggle
(function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('header');
  if (!toggle || !header) return;

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is tapped on mobile
  document.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

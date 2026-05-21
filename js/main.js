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

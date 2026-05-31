/* ============================================
   slideshow.js — Home Page Slideshow
   Kelson & Isabella Wedding
   ============================================ */

(function initSlideshow() {
  const slides = document.querySelectorAll('.slideshow .slide');
  if (!slides.length) return;

  // Measure the header height once and set the CSS variable used by home.css
  const header = document.querySelector('header');
  if (header) {
    const setHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--header-h',
        header.getBoundingClientRect().height + 'px'
      );
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
  }

  let current = 0;
  const INTERVAL_MS = 7500; // time each photo is shown
  let timer;

  function goTo(index) {
    slides[current].classList.remove('slide--active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('slide--active');
  }

  function next() {
    goTo(current + 1);
  }

  // Auto-advance
  function startTimer() {
    timer = setInterval(next, INTERVAL_MS);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  startTimer();

  // Pause when tab is not visible (saves battery on mobile)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      resetTimer();
    }
  });
})();

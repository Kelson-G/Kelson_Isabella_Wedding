/* ============================================
   forms.js — Google Forms & RSVP Counter
   Kelson & Isabella Wedding
   ============================================ */

// --- Configuration ---

// 1. Google Form embed URL
//    The ?embedded=true param is required for the iframe to work.
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfOJ-VZiTQvI6G_g_nRmLsPXnyNPcRcf70AMD4scPyCvBfxlw/viewform?embedded=true';

// 2. Paste your Apps Script web app deployment URL here.
//    See apps-script/rsvp.gs for setup instructions.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7eegMZfBwmoeFv7DlskEya_VF7w4AEmARuQXfEygz-A_NmKRjaXgpTWe3ztBMiFf6/exec';

// --- Initialize Google Form embed ---
(function initRsvpForm() {
  const iframe = document.getElementById('rsvp-form');
  if (!iframe) return;

  if (GOOGLE_FORM_URL) {
    iframe.src = GOOGLE_FORM_URL;
  } else {
    const section = iframe.closest('.form-section');
    if (section) {
      section.innerHTML = '<p class="text-muted text-center">RSVP form coming soon — check back shortly!</p>';
    }
  }
})();

// --- Fetch and display live RSVP stats ---
(async function fetchRsvpCount() {
  if (!APPS_SCRIPT_URL) return;

  try {
    const res = await fetch(APPS_SCRIPT_URL);
    if (!res.ok) return;
    const data = await res.json();

    const stats = document.getElementById('rsvp-stats');
    if (!stats) return;

    const setCount = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

    setCount('rsvp-count-total', plural(data.total_expected, 'guest'));
    setCount('rsvp-count-wa',    plural(data.washington_expected, 'guest'));
    setCount('rsvp-count-id',    plural(data.idaho_expected, 'guest'));
    setCount('rsvp-count-forms', plural(data.total_rsvpd, 'response'));

    stats.hidden = false;
  } catch (_) {
    // Fail silently — stats just won't appear if the endpoint is unavailable
  }
})();

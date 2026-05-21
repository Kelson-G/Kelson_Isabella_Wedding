/* ============================================
   forms.js — Google Forms Integration
   Kelson & Isabella Wedding
   ============================================ */

// Google Form embed src — set this once the form is created
const GOOGLE_FORM_URL = '';

(function initRsvpForm() {
  const iframe = document.getElementById('rsvp-form');
  if (!iframe) return;

  if (GOOGLE_FORM_URL) {
    iframe.src = GOOGLE_FORM_URL;
  } else {
    // Placeholder message while form URL is not yet configured
    const section = iframe.closest('.form-section');
    if (section) {
      section.innerHTML = '<p class="text-muted text-center">RSVP form coming soon.</p>';
    }
  }
})();

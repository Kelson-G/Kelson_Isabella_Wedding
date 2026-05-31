// rsvp.gs — Google Apps Script for Kelson & Isabella RSVP Counter
//
// HOW TO USE:
//   1. Open the Google Sheets spreadsheet linked to your Google Form
//      (Form → Responses tab → Sheets icon)
//   2. Extensions → Apps Script → replace everything with this file
//   3. Deploy → New deployment → Web app
//        Execute as: Me
//        Who has access: Anyone
//   4. Copy the deployment URL and paste it into APPS_SCRIPT_URL in js/forms.js
//
// IMPORTANT — Column order must match your form's question order.
//   If you reorder questions in the form, update the column numbers below.
// ---------------------------------------------------------------

// Column positions (1-based). Column 1 is always the auto-added Timestamp.
var COL_TIMESTAMP  = 1; // Auto-added by Google Forms — not used
var COL_NAME       = 2; // Q1: Name — not used in calculations
var COL_RECEPTION  = 3; // Q2: Which reception(s) do you plan to attend?
var COL_ATTENDANCE = 4; // Q3: Do you plan to make it?
var COL_JOINING    = 5; // Q4: How many will be joining you?

// ---------------------------------------------------------------
// Exact text of your form's answer options.
// These must match character-for-character what the form produces.
// ---------------------------------------------------------------
var OPT_YES        = 'Yes';
var OPT_MAYBE      = 'Maybe';
var OPT_NO         = 'No';
var OPT_WASHINGTON = 'Washington';
var OPT_IDAHO      = 'Idaho';
var OPT_BOTH       = 'Both';

// Maybes contribute this fraction toward the expected guest count
var MAYBE_WEIGHT = 0.25;

// ---------------------------------------------------------------
// Main endpoint — fetched by the wedding website
// Returns JSON: { total_rsvpd, total_expected,
//                 washington_expected, idaho_expected }
// ---------------------------------------------------------------
function doGet() {
  var sheet   = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var lastRow = sheet.getLastRow();

  var result = {
    total_rsvpd:         0, // responses received (yes + maybe, excluding no)
    total_expected:      0, // weighted expected guest count across both receptions
    washington_expected: 0, // weighted guests for Washington reception
    idaho_expected:      0  // weighted guests for Idaho reception
  };

  if (lastRow < 2) {
    return jsonResponse(result); // no responses yet
  }

  var data = sheet.getRange(2, 1, lastRow - 1, COL_JOINING).getValues();

  data.forEach(function (row) {
    var attendance = String(row[COL_ATTENDANCE - 1]).trim();
    var reception  = String(row[COL_RECEPTION  - 1]).trim();
    var joiningRaw = String(row[COL_JOINING    - 1]).trim();

    // Skip blank rows and No responses
    if (!attendance || attendance.toLowerCase() === OPT_NO.toLowerCase()) return;

    result.total_rsvpd++;

    // "How many will be joining you?" = additional guests beyond the respondent.
    // e.g. "2" means them + 2 = 3 total; blank / "0" / "none" means just them = 1 total.
    var joiningCount = wordToNumber(joiningRaw);
    var partySize    = 1 + joiningCount;

    var weight   = (attendance === OPT_MAYBE) ? MAYBE_WEIGHT : 1;
    var expected = partySize * weight;

    result.total_expected += expected;

    if (reception === OPT_WASHINGTON || reception === OPT_BOTH) {
      result.washington_expected += expected;
    }
    if (reception === OPT_IDAHO || reception === OPT_BOTH) {
      result.idaho_expected += expected;
    }
  });

  // Round to whole numbers for cleaner display
  result.total_expected        = Math.round(result.total_expected);
  result.washington_expected   = Math.round(result.washington_expected);
  result.idaho_expected        = Math.round(result.idaho_expected);

  return jsonResponse(result);
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Converts a guest-count string to an integer.
 * Handles digits ("3"), written numbers ("three"), and no-show phrases ("none", "just me").
 * Returns 0 for anything unrecognisable (treated as no additional guests).
 */
function wordToNumber(str) {
  if (!str) return 0;

  var lower = str.toLowerCase().trim();

  // Common "none" phrases
  if (['none', 'no one', 'just me', 'just myself', 'only me', '0', 'zero'].indexOf(lower) !== -1) {
    return 0;
  }

  // Try a straight numeric parse first ("1", "12", etc.)
  var n = parseInt(str, 10);
  if (!isNaN(n)) return Math.max(0, n);

  // Written-out number words
  var wordMap = {
    'one':       1,  'two':       2,  'three':  3,  'four':    4,
    'five':      5,  'six':       6,  'seven':  7,  'eight':   8,
    'nine':      9,  'ten':      10,  'eleven': 11, 'twelve':  12,
    'thirteen': 13,  'fourteen': 14,  'fifteen':15, 'sixteen': 16,
    'seventeen':17,  'eighteen': 18,  'nineteen':19,'twenty':  20
  };

  return (wordMap[lower] !== undefined) ? wordMap[lower] : 0;
}

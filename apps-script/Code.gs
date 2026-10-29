/**
 * RSVP backend for the Ayush & Mahima wedding site.
 * Create a new project at https://script.google.com, paste this file, run `setup` once (it creates the "Wedding RSVPs"
 * Sheet in your Drive and asks for permission), then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone). Each RSVP becomes a row in the Sheet's "RSVPs" tab and the guest gets an email.
 * It also works when pasted into a Sheet's own Extensions > Apps Script (then that Sheet is used).
 */
var SHEET_NAME = 'RSVPs';
var MAX_GUESTS = 20;
var VENUE = {
  name: 'The Democracy Hotel',
  address: 'Ashoknagar, Satpur Colony, Nashik, Maharashtra 422007, India',
  maps: 'https://www.google.com/maps/search/?api=1&query=The%20Democracy%20Hotel%2C%20Ashoknagar%2C%20Satpur%20Colony%2C%20Nashik%2C%20Maharashtra%20422007%2C%20India'
};
// Keep in sync with js/config.js (a test compares them).
var EVENTS = [
  { id: 'mayra', name: 'Mayra', when: 'Friday 11 Dec, 10:00 AM', where: 'Ganga Ghat Hall' },
  { id: 'haldi', name: 'Haldi', when: 'Friday 11 Dec, 3:00 PM', where: 'Poolside Lawn' },
  { id: 'sangeet', name: 'Sangeet', when: 'Friday 11 Dec, 7:30 PM', where: 'Congruence Convention Hall' },
  { id: 'reception', name: 'Baarat Swaagat & Reception', when: 'Saturday 12 Dec, 11:00 AM', where: 'Congruence Convention Hall' },
  { id: 'phere', name: 'Phere & Saptapadi', when: 'Saturday 12 Dec, 4:00 PM', where: 'Ganga Ghat Amphitheater' }
];

function eventsForVariant(variant) {
  return EVENTS.filter(function (e) { return variant !== 'core' || e.id !== 'mayra'; });
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function validateRsvp(body) {
  body = body || {};
  var name = String(body.name == null ? '' : body.name).replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  var email = String(body.email == null ? '' : body.email).trim().toLowerCase();
  var attending = body.attending;
  if (!name || name.length > 80) return { ok: false, error: 'name' };
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: 'email' };
  if (attending !== 'Yes' && attending !== 'No') return { ok: false, error: 'attending' };
  var count = 0;
  if (attending === 'Yes') {
    count = Number(body.count);
    if (!isFinite(count) || Math.floor(count) !== count || count < 1 || count > MAX_GUESTS) return { ok: false, error: 'count' };
  }
  var variant = body.variant === 'core' ? 'core' : 'full';
  return { ok: true, honeypot: !!body.website, data: { name: name, email: email, attending: attending, count: count, variant: variant } };
}

function coupleNames(variant) {
  return variant === 'core' ? 'Ayush & Mahima' : 'Mahima & Ayush'; // same order as the link the guest used
}

function buildEmail(d) {
  var couple = coupleNames(d.variant);
  var subject = 'Your RSVP for ' + couple + "'s wedding";
  var lines = [];
  var rows = [];
  if (d.attending === 'Yes') {
    lines.push('Thank you, ' + d.name + '! We have your RSVP: joyfully accepted for ' + d.count + (d.count === 1 ? ' guest.' : ' guests.'));
    lines.push('', 'Wedding: 11th & 12th December 2026', 'Venue: ' + VENUE.name + ', ' + VENUE.address, 'Map: ' + VENUE.maps, '');
    eventsForVariant(d.variant).forEach(function (e) {
      lines.push('- ' + e.name + ': ' + e.when + ', ' + e.where);
      rows.push('<li><b>' + esc(e.name) + '</b> &middot; ' + esc(e.when) + ' &middot; ' + esc(e.where) + '</li>');
    });
    lines.push('', 'We cannot wait to celebrate with you! #AyushMahnbhava', '', couple);
  } else {
    lines.push('Thank you for letting us know, ' + d.name + '. We will miss you at the wedding, and we are grateful for your good wishes.', '', couple);
  }
  var html = '<div style="font-family:Georgia,serif;color:#3b2a2a;max-width:520px;line-height:1.5">' +
    '<h2 style="color:#6e1a27;font-weight:normal">' + esc(couple) + '</h2>' +
    (d.attending === 'Yes'
      ? '<p>Thank you, <b>' + esc(d.name) + '</b>! We have your RSVP: joyfully accepted for <b>' + d.count + (d.count === 1 ? ' guest' : ' guests') + '</b>.</p>' +
        '<p>11th &amp; 12th December 2026<br>' + esc(VENUE.name) + ', ' + esc(VENUE.address) + '<br><a href="' + VENUE.maps + '">Open in Google Maps</a></p>' +
        '<ul style="padding-left:18px">' + rows.join('') + '</ul><p>We cannot wait to celebrate with you!<br>#AyushMahnbhava</p>'
      : '<p>Thank you for letting us know, <b>' + esc(d.name) + '</b>. We will miss you at the wedding, and we are grateful for your good wishes.</p>') +
    '</div>';
  return { subject: subject, text: lines.join('\n'), html: html };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet_() {
  var active = SpreadsheetApp.getActiveSpreadsheet(); // set when the script lives inside a Sheet
  if (active) return active;
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) { try { return SpreadsheetApp.openById(id); } catch (err) { /* deleted: create a fresh one */ } }
  var ss = SpreadsheetApp.create('Wedding RSVPs');
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

/** Run this once from the editor: creates the Sheet, asks for permissions and logs the Sheet's address. */
function setup() {
  var ss = getSpreadsheet_();
  Logger.log('RSVPs will be saved in: ' + ss.getUrl());
  MailApp.getRemainingDailyQuota();
}

function appendRow_(d) {
  var ss = getSpreadsheet_();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Time', 'Name', 'Email', 'Attending', 'People', 'Link']);
    sh.setFrozenRows(1);
  }
  sh.appendRow([new Date(), d.name, d.email, d.attending, d.count, d.variant === 'core' ? 'without Mayra' : 'full']);
}

function sendConfirmation_(d) {
  try {
    if (MailApp.getRemainingDailyQuota() < 1) return { sent: false, why: 'quota' };
    var cache = CacheService.getScriptCache();
    var key = 'mail:' + d.email;
    if (cache.get(key)) return { sent: false, why: 'recent' }; // same address within 10 minutes: recorded, not emailed again
    var m = buildEmail(d);
    MailApp.sendEmail({ to: d.email, subject: m.subject, body: m.text, htmlBody: m.html, name: coupleNames(d.variant) });
    cache.put(key, '1', 600);
    return { sent: true, why: 'sent' };
  } catch (err) {
    console.error('confirmation email failed: ' + err); // visible under Executions in the Apps Script editor
    return { sent: false, why: 'error' };
  }
}

function doPost(e) {
  try {
    var v = validateRsvp(JSON.parse(e.postData.contents));
    if (!v.ok) return json_({ ok: false, error: v.error });
    if (v.honeypot) return json_({ ok: true, emailed: false });
    var lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try { appendRow_(v.data); } finally { lock.releaseLock(); }
    var mail = sendConfirmation_(v.data);
    return json_({ ok: true, emailed: mail.sent, emailWhy: mail.why });
  } catch (err) {
    return json_({ ok: false, error: 'server' });
  }
}

function doGet() {
  return json_({ ok: true, service: 'rsvp' });
}

if (typeof module !== 'undefined') {
  module.exports = { validateRsvp: validateRsvp, buildEmail: buildEmail, EVENTS: EVENTS, eventsForVariant: eventsForVariant, sendConfirmation_: sendConfirmation_ };
}

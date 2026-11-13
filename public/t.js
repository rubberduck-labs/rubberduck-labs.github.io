// Egen statistikk til Supabase. Ingen cookies, og ingenting skrives i nettleseren.
// Nyttelasten er kompakt og AES-kryptert. Nøkkelen står her, så dette er ikke hemmelig, bare uleselig i nettverksfanen.
(function () {
  if (navigator.doNotTrack === '1') return;
  // /live/ er intern og skal aldri telles.
  if (location.pathname.indexOf('/live') === 0) return;
  // Er du innlogget på /live/ i denne nettleseren, telles ikke dine egne besøk.
  try { if (localStorage.getItem('rd-stats-token')) return; } catch (e) {}
  if (!window.crypto || !crypto.subtle) return;
  var URL_ = 'https://cttwgsndqzemsomzuijf.supabase.co/functions/v1/ping';
  var KEY = '0NSjKne/Zmqo4kiZqwv88vOHs30JItG6FQQrY7Eeki8=';
  var CODES = { pageview: 'a', apply_click: 'b', apply_sent: 'c', contact_sent: 'd', linkedin_click: 'e', message_started: 'f', calc_used: 'g', team_cv_open: 'h' };
  var bytes = function (b64) { return Uint8Array.from(atob(b64), function (c) { return c.charCodeAt(0); }); };
  var b64url = function (u8) { var s = ''; for (var i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  var key = crypto.subtle.importKey('raw', bytes(KEY), 'AES-GCM', false, ['encrypt']);
  var path = function () { return location.hash.indexOf('#/') === 0 ? location.hash.slice(1) : location.pathname; };
  var first = true;
  function send(e, label) {
    try {
      if (!CODES[e]) return;
      var q = new URLSearchParams(location.search);
      var list = [CODES[e], typeof label === 'string' ? label : null, path(), window.innerWidth,
        first && e === 'pageview' ? document.referrer || null : null, q.get('utm_source') || null, q.get('utm_campaign') || null];
      if (e === 'pageview') first = false;
      var iv = crypto.getRandomValues(new Uint8Array(12));
      key.then(function (k) { return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, new TextEncoder().encode(JSON.stringify(list))); })
        .then(function (ct) {
          var out = new Uint8Array(12 + ct.byteLength); out.set(iv); out.set(new Uint8Array(ct), 12);
          var body = b64url(out);
          if (navigator.sendBeacon) navigator.sendBeacon(URL_, new Blob([body], { type: 'text/plain' }));
          else fetch(URL_, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' });
        }).catch(function () {});
    } catch (err) {}
  }
  window.rdTrack = send;
  send('pageview');
  window.addEventListener('hashchange', function () { send('pageview'); });
})();

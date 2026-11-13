// Egen statistikk til Supabase (Edge Function `t`). Ingen cookies, og ingenting skrives i nettleseren.
(function () {
  if (navigator.doNotTrack === '1') return;
  // Er du innlogget på /live/ i denne nettleseren, telles ikke dine egne besøk.
  try { if (localStorage.getItem('rd-stats-token')) return; } catch (e) {}
  var URL_ = 'https://cttwgsndqzemsomzuijf.supabase.co/functions/v1/t';
  var path = function () { return location.hash.indexOf('#/') === 0 ? location.hash.slice(1) : location.pathname; };
  var first = true;
  function send(e) {
    try {
      var q = new URLSearchParams(location.search);
      var body = JSON.stringify({
        e: e, p: path(), w: window.innerWidth,
        r: first && e === 'pageview' ? document.referrer || undefined : undefined,
        u: { source: q.get('utm_source') || undefined, campaign: q.get('utm_campaign') || undefined },
      });
      if (e === 'pageview') first = false;
      if (navigator.sendBeacon) navigator.sendBeacon(URL_, new Blob([body], { type: 'text/plain' }));
      else fetch(URL_, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' });
    } catch (err) {}
  }
  window.rdTrack = send;
  send('pageview');
  window.addEventListener('hashchange', function () { send('pageview'); });
})();

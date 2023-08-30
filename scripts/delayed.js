// eslint-disable-next-line import/no-cycle
import { fetchPlaceholders, sampleRUM, loadScript } from './lib-franklin.js';

const placeholders = await fetchPlaceholders();

function loadGoogleTagManager() {
  // google tag manager
  const { gtmId } = placeholders;
  // eslint-disable-next-line
  (function (w, d, s, l, i) { w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f); })(window, document, 'script', 'dataLayer', gtmId);
}

// Core Web Vitals RUM collection
sampleRUM('cwv');

loadGoogleTagManager();
loadScript('./scripts/lottie-player.js');

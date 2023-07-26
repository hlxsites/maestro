import { loadCSS } from '../../scripts/lib-franklin.js';

const jsonpGist = (url, callback) => {
  // Setup a unique name that cane be called & destroyed
  const callbackName = `jsonp_${Math.round(100000 * Math.random())}`;

  // Create the script tag
  const script = document.createElement('script');
  script.src = `${url}${(url.indexOf('?') >= 0 ? '&' : '?')}callback=${callbackName}`;

  // Define the function that the script will call
  window[callbackName] = (data) => {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  // Append to the document
  document.body.appendChild(script);
};

const gist = (element) => {
  const { href } = element;
  const url = href.slice(-2) === 'js' ? `${href}on` : `${href}.json`;

  jsonpGist(url, (data) => {
    loadCSS(data.stylesheet);
    element.insertAdjacentHTML('afterend', data.div);
    element.remove();
  });
};

const youtube = (element) => {
  const url = new URL(element.href);
  const vid = url.searchParams.get('v');
  const html = `<div class="youtube-wrapper">
          <iframe src="https://www.youtube.com/embed/${vid}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen="" scrolling="no" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="Content from Youtube" loading="lazy"></iframe>
      </div>`;
  element.parentElement.insertAdjacentHTML('afterend', html);
  element.parentElement.remove();
};

const vimeo = (element) => {
  const url = new URL(element.href);
  const vid = url.searchParams.get('v');
  const html = `<div class="vimeo-wrapper">
          <iframe src="https://player.vimeo.com/video/${vid}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allow="autoplay; fullscreen" title="Content from Vimeo" loading="lazy" allowfullscreen></iframe>
      </div>`;
  element.parentElement.insertAdjacentHTML('afterend', html);
  element.parentElement.remove();
  };
  
const simplecast = (element) => {
  const url = new URL(element.href);
  const vid = url.searchParams.get('v');
  const html = `<div class="simplecast-wrapper">
          <iframe src="https://player.simplecast.com/video/${vid}" style="border: 0; top: 0; left: 0; width: 100%; height: 200px; position: absolute;" allow="autoplay; fullscreen" title="Content from Simplecast" loading="lazy"></iframe>
      </div>`;
  element.parentElement.insertAdjacentHTML('afterend', html);
  element.parentElement.remove();
  };

export default function decorate(block) {
  const a = block.querySelector('a');
  const { hostname } = new URL(a.href);
  if (hostname.includes('youtu')) {
    youtube(a);
  }
  else if (hostname.includes('vimeo')) {
    vimeo(a);
  } else if (hostname.includes('simplecast')) {
    simplecast(a);
  } else if (hostname.includes('gist')) {
    gist(a);
  }

}
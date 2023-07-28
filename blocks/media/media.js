import { createVideoModal } from '../../scripts/scripts.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedVimeo = (url, autoplay) => {
  const [, video] = url.pathname.split('/');
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const getMP4Embed = (url) => `
  <video width="100%" controls>
    <source src="${url.href}" type="video/mp4">
    Your browser does not support the video tag.
  </video>
`;

const getPlaceholderHTML = (url) => `

    <div class="media-player">
      <div class="media-player__wrapper">
       <video src="${url}" preload="auto" style="width: 100%; height: 100%;"></video>
      </div>
      <div class="media-player__overlay"></div>
      <button class="Button media-player__play" type="button" aria-label="Play">
      <svg width="128" height="129" viewBox="0 0 128 129" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity=".9" fill-rule="evenodd" clip-rule="evenodd" d="M64 128.5c35.346 0 64-28.654 64-64 0-35.347-28.654-64-64-64-35.346 0-64 28.653-64 64 0 35.346 28.654 64 64 64z" fill="#27292B">
          </path>
          <mask id="a" fill="#fff">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M97.893 64.5L47.22 35.244v58.511L97.893 64.5zm-10.394 0L52.418 44.246v40.508L87.498 64.5z"></path>
          </mask>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M97.893 64.5L47.22 35.244v58.511L97.893 64.5zm-10.394 0L52.418 44.246v40.508L87.498 64.5z" fill="#fff">
          </path>
          <path d="M97.893 64.5l3 5.196 9-5.196-9-5.197-3 5.197zM47.22 35.244l3-5.196-9-5.196v10.392h6zm0 58.511h-6v10.393l9-5.197-3-5.196zm5.198-49.51l3-5.195-9-5.197v10.393h6zM87.498 64.5l3 5.196 9-5.196-9-5.197-3 5.197zm-35.08 20.254h-6v10.392l9-5.196-3-5.196zm-3-35.312l35.08 20.254 6-10.392-35.08-20.255-6 10.393zm9 35.312V44.246h-12v40.508h12zm26.08-25.45l-35.08 20.254 6 10.392 35.08-20.254-6-10.392zM44.22 40.44l50.673 29.256 6-10.392L50.22 30.047l-6 10.392zm9 53.315V35.244h-12v58.511h12zm41.673-34.451L44.22 88.558l6 10.392 50.673-29.255-6-10.392z" fill="#fff" mask="url(#a)">
          </path>
        </svg>
      </button>
    </div>
  `;

const loadMedia = (block, link, view) => {
  if (block.classList.contains('media-is-loaded')) {
    return;
  }

  const MEDIA_CONFIG = [
    {
      match: ['vimeo'],
      name: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['.mp4'],
      name: ['mp4'],
      embed: (url) => {
        if (view && view === 'modal') {
          const placeholderHTML = getPlaceholderHTML(url);
          block.innerHTML = placeholderHTML;
          block.classList = 'block media media-mp4';
          const video = block.querySelector('video');
          block.addEventListener('click', (e) => {
            e.preventDefault();
            createVideoModal(block, url);
          });
          return placeholderHTML;
        }
        return getMP4Embed(url);
      },
    },
  ];

  const config = MEDIA_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url);
    block.classList = `block media media-${config.name[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block media';
  }
  block.classList.add('media-is-loaded');
};

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;

  const cfg = readBlockConfig(block);

  block.textContent = '';

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'media-placeholder';
    wrapper.innerHTML = '<div class="media-placeholder-play"><button title="Play"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => {
      loadMedia(block, link, true);
    });
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadMedia(block, link, cfg.view);
      }
    });
    observer.observe(block);
  }
}

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

const getMP4Embed = (url, posterUrl = '') => {
  const uniqueId = `mediaMp4Embed${Math.floor(Math.random() * 100000)}`;
  const playButtonId = `playButton${Math.floor(Math.random() * 100000)}`;

  const html = `
    <div class="media-mp4-wrapper">
      <video id="${uniqueId}" src="${url.href}" width="100%" loop="" class="media-mp4-video" poster="${posterUrl}"
             onclick="this.paused ? 
                      this.play() : 
                      this.pause();
                      this.parentElement.querySelector('#${playButtonId}').style.display = 
                      this.paused ? 'block' : 'none';">
        Your browser does not support the video tag.
      </video>
      <div class="media-mp4-overlay">
        <div id="${playButtonId}" class="media-mp4-play">
        </div>
      </div>
    </div>
  `;

  return { html };
};

// Function that returns HTML string for the media placeholder
const getPlaceholderHTML = (url, posterUrl = '') => `
    <div class="media-player">
      <div class="media-player-wrapper">
       <video src="${url}" preload="auto" style="width: 100%; height: 100%;" poster="${posterUrl}"></video>
      </div>
      <div class="media-player-overlay"></div>
      <button class="Button media-player-play" type="button" aria-label="Play"></button>
    </div>
  `;

const loadMedia = (block, link, view, posterUrl) => {
  if (block.classList.contains('media-is-loaded')) {
    return;
  }

  // Configuration for supported media types
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
        // If it's mp4 media and it's to be viewed in modal
        if (view && view === 'modal') {
          const placeholderHTML = getPlaceholderHTML(url, posterUrl);
          block.innerHTML = placeholderHTML;
          block.classList = 'block media media-mp4';

          // Add event listener for clicks to create or remove modal
          block.addEventListener('click', (e) => {
            const { classList } = e.target;
            e.preventDefault();
            const videoModal = block.querySelector('.video-modal-container');
            if (!videoModal && !classList.contains('video-close')) {
              createVideoModal(block, url);
            } else if (!classList.contains('video-close') && !classList.contains('video-iframe')) {
              videoModal.remove();
            }
          });

          return placeholderHTML;
        }
        // If it's not in modal view, just embed the mp4
        const mp4Embed = getMP4Embed(url, posterUrl);
        block.innerHTML = mp4Embed.html;
        return mp4Embed.html;
      },
    },
  ];

  const config = MEDIA_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    const result = config.embed(url);
    block.innerHTML = result.html || result;
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
  let posterUrl;

  block.textContent = '';

  if (placeholder) {
    const img = placeholder.querySelector('img');
    posterUrl = img ? img.src : ''; // Use src of img as poster URL
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadMedia(block, link, cfg.view, posterUrl);
    }
  });
  observer.observe(block);
}

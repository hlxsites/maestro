// Embeds Configuration
const EMBEDS_CONFIG = [
  {
    match: ['youtube', 'youtu.be'],
    embed: embedYoutube,
  },
  {
    match: ['vimeo'],
    embed: embedVimeo,
  },
  {
    match: ['twitter'],
    embed: embedTwitter,
  },
];

// Load Script Function
const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

// Embed Functions
const embedYoutube = (url, autoplay) => { /* ... */ };
const embedVimeo = (url, autoplay) => { /* ... */ };
const embedTwitter = (url) => { /* ... */ };

// Default Embed Function
const getDefaultEmbed = (url) => {
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;
  return embedHTML;
};

// Load Embed Function
const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  for (const config of EMBEDS_CONFIG) {
    const url = new URL(link);
    if (config.match.some((match) => url.href.includes(match))) {
      const embedHTML = config.embed(url, autoplay);
      block.innerHTML = embedHTML;
      block.classList = `block embed embed-${config.match[0]} embed-is-loaded`;
      return;
    }
  }

  block.innerHTML = getDefaultEmbed(url);
  block.classList = 'block embed embed-is-loaded';
};

// Decorate Function
export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  block.textContent = '';

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    wrapper.innerHTML = '<div class="embed-placeholder-play"><button title="Play"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => {
      loadEmbed(block, link, true);
    });
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadEmbed(block, link);
      }
    });
    observer.observe(block);
  }
}

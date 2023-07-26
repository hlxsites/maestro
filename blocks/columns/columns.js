export function createVideoModal(block, url) {
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container');
  const videoWrap = document.createElement('div');
  videoWrap.classList.add('video-wrap');
  const close = document.createElement('div');
  close.classList.add('video-close');
  const videoIframe = document.createElement('video');
  const videoSrc = document.createElement('source');
  videoIframe.classList.add('video-iframe');
  videoIframe.setAttribute('autoplay', '');
  videoIframe.setAttribute('controls', '');
  videoSrc.setAttribute('src', `${url}`);
  videoSrc.setAttribute('type', 'video/mp4');
  videoIframe.append(videoSrc);
  videoWrap.append(close, videoIframe);
  videoContainer.append(videoWrap);
  block.append(videoContainer);

  const closeButton = block.querySelector('.video-close');
  const videoContainerDiv = block.querySelector('.video-container');
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      videoContainerDiv.remove();
    });

    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 27 || event.key === 'Escape') {
        videoContainerDiv.remove();
      }
    });
  }
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  block.querySelectorAll('a').forEach((a) => {
    const url = new URL(a.href);
    if (a.href.endsWith('.mp4')) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        createVideoModal(block, url);
      });
    }
  });
}

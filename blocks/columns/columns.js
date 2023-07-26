import { createVideoModal } from '../../scripts/scripts.js';

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

import ffetch from '../../scripts/ffetch.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const link = block.querySelector('a').href;
  const path = new URL(link).pathname;

  block.innerHTML = '';
  const allentries = await ffetch('/query-index.json')
    .filter((p) => p.template === 'insights' && p.path === path)
    .all();
  allentries.forEach((e) => {
    const teaserBadge = document.createElement('div');
    teaserBadge.classList.add('teaser-badge');
    teaserBadge.textContent = 'Next Up in ';
    const teaserBadgeSpan = document.createElement('span');
    teaserBadgeSpan.textContent = 'Insights';
    teaserBadge.append(teaserBadgeSpan);

    const teaserTitle = document.createElement('a');
    teaserTitle.classList.add('teaser-link');
    teaserTitle.setAttribute('href', e.path);
    teaserTitle.innerHTML = e.title;

    const teaserDescription = document.createElement('div');
    teaserDescription.classList.add('teaser-description');
    teaserDescription.innerHTML = e.description;

    const teaserAuthor = document.createElement('div');
    teaserAuthor.classList.add('teaser-author');
    const teaserAuthorText = document.createElement('span');
    teaserAuthorText.classList.add('teaser-authorwords');
    teaserAuthorText.textContent = 'Words by ';
    const teaserAuthorName = document.createElement('span');
    teaserAuthorName.classList.add('teaser-authorname');
    teaserAuthorName.textContent = `${e.authorname}`;
    const teaserAuthorTitle = document.createElement('span');
    teaserAuthorTitle.classList.add('teaser-authortitle');
    teaserAuthorTitle.textContent = `, ${e.authortitle}`;
    teaserAuthor.append(teaserAuthorText, teaserAuthorName, teaserAuthorTitle);

    const teaserImageLink = document.createElement('a');
    teaserImageLink.classList.add('teaser-image-link');
    teaserImageLink.setAttribute('href', e.path);
    const teaserImage = createOptimizedPicture(e.image);
    teaserImage.classList.add('teaser-image');
    teaserImageLink.append(teaserImage);

    block.append(teaserBadge, teaserTitle, teaserDescription, teaserAuthor, teaserImageLink);
  });
}

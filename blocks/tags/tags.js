import { getMetadata } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const tags = getMetadata('article:tag');
  if (tags) {
    const uniqueTags = new Set(tags.split(',').map((element) => element.trim()));
    block.innerHTML = '';
    const tagsUl = document.createElement('ul');
    uniqueTags.forEach((item) => {
      const tagItem = document.createElement('li');
      tagItem.classList.add('tag-item');
      const tag = document.createElement('a');
      tag.classList.add('tag');
      const hrefValue = `/insights/tags/${item.toLowerCase().replace(/\s+/g, '-')}`;
      tag.setAttribute('href', hrefValue);
      tag.innerHTML = item;
      tagItem.append(tag);
      tagsUl.appendChild(tagItem);
    });
    block.append(tagsUl);
  }
}

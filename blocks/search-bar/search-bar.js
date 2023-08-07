import createTag from '../../utils/tag.js';
import ffetch from '../../scripts/ffetch.js';

let searchFunc;

const loadSearch = async (inputsArray, resultsContainer) => {
  const gnavSearch = await import('./search.js');
  searchFunc = gnavSearch.default;  
  searchFunc(null, resultsContainer);  
};

async function buildTags() {
  const articles = await ffetch('/query-index.json')
    .filter((p) => p.template === 'insights')
    .all();
  const tags = [];
  articles.forEach((article) => {
    article.tags.split('"').forEach((item) => {
      if (item !== '[' && item !== ']' && item !== ',') {
        tags.push(item);
      }
    });
  });
  const uniqueTags = new Set(tags);
  const tagsUl = document.createElement('ul');
  uniqueTags.forEach((item) => {
    const tagItem = document.createElement('li');
    tagItem.classList.add('tag-item');
    const tag = document.createElement('a');
    tag.classList.add('tag');
    tag.innerHTML = item;
    tagItem.append(tag);
    tagsUl.appendChild(tagItem);
  });
  return tagsUl;
}

export default async function decorate(block) {
  block.textContent = '';
  const tags = await buildTags();
  const tagList = createTag('div', { class: 'tags-wrapper' }, tags.outerHTML);
  block.append(tagList);
  const searchInputInner = '<input type="text" name="search" placeholder="Search">';
  const searchInput = createTag('div', { class: 'search-input-wrapper' }, searchInputInner);
  const searchInputOuter = searchInput.cloneNode(true);
  const resultsContainer = createTag('div', { class: 'results-wrapper', id: 'search-results' });
  block.append(searchInputOuter);
  const results = document.getElementById('results');
  results.append(resultsContainer);
  loadSearch([searchInput, searchInputOuter], resultsContainer);
  [searchInput, searchInputOuter].forEach((el) => {
    el.querySelector('input').addEventListener('input', (event) => {
      if (event.target.value.length === 0) {        
        searchFunc(null, resultsContainer);
      } else {        
        searchFunc(event.target.value, resultsContainer);
      }
    });
  });
  tagList.querySelectorAll('li > a').forEach((link) => {
    link.addEventListener('click', () => {
      const tagFilterList = [];
      if (link.classList.contains('highlight')) {
        link.classList.remove('highlight');
        tagFilterList.splice(tagFilterList.indexOf(link.innerText), 1);
      } else {
        tagFilterList.push(link.innerText);        
        link.classList.add('highlight');
      }
      if (tagFilterList.length === 0) searchFunc(null, resultsContainer, false);
      else searchFunc(tagFilterList, resultsContainer, true);
    });
  });
}

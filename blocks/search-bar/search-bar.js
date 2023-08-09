import ffetch from '../../scripts/ffetch.js';

let searchFunc;

const loadSearch = async (inputsArray, resultsContainer, tag) => {
  const gnavSearch = await import('./search.js');
  searchFunc = gnavSearch.default;
  if (tag) searchFunc(inputsArray, resultsContainer, true);
  else searchFunc(null, resultsContainer, false);
};

async function buildTags(blockvalue) {
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
    if (blockvalue.toLowerCase() === item.toLowerCase()) tag.classList.add('highlight');
  });
  return tagsUl;
}

export default async function decorate(block) {
  const blockvalue = [...block.children][0].querySelector('div:nth-of-type(2)');
  const defaulttag = blockvalue != null ? blockvalue.innerText : '';
  block.textContent = '';
  const tags = await buildTags(defaulttag);
  const title = '<h2>Browse Insights</h2> <a class="clear-btn">Clear All</a>';
  const tagsheader = document.createElement('div');
  tagsheader.classList.add('tagsheader');
  tagsheader.innerHTML = title;
  const tagList = document.createElement('div');
  tagList.classList.add('tags-wrapper');
  tagList.innerHTML = tags.outerHTML;
  tagList.prepend(tagsheader);
  block.append(tagList);
  const searchInputInner = '<input type="text" name="search" placeholder="Search">';
  const searchInput = document.createElement('div');
  searchInput.classList.add('search-input-wrapper');
  searchInput.innerHTML = searchInputInner;
  const searchInputOuter = searchInput.cloneNode(true);
  const resultsContainer = document.createElement('div');
  resultsContainer.classList.add('results-wrapper');
  resultsContainer.setAttribute('id', 'search-results');
  block.append(searchInputOuter);
  const results = document.createElement('div');
  results.setAttribute('id', 'results');
  results.className = 'results';
  results.append(resultsContainer);
  block.parentElement.append(results);
  if (blockvalue) {
    loadSearch([defaulttag], resultsContainer, true);
    document.getElementsByClassName('clear-btn')[0].style.visibility = 'visible';
  } else loadSearch([searchInput, searchInputOuter], resultsContainer, false);
  [searchInput, searchInputOuter].forEach((el) => {
    el.querySelector('input').addEventListener('input', (event) => {
      if (event.target.value.length === 0) {
        searchFunc(null, resultsContainer);
      } else {
        searchFunc(event.target.value, resultsContainer);
      }
    });
  });
  const tagFilterList = [];
  tagList.querySelectorAll('li > a').forEach((link) => {
    link.addEventListener('click', () => {
      if (link.classList.contains('highlight')) {
        link.classList.remove('highlight');
        tagFilterList.splice(tagFilterList.indexOf(link.innerText), 1);
      } else {
        tagFilterList.push(link.innerText);
        link.classList.add('highlight');
      }
      if (tagFilterList.length === 0) {
        document.getElementsByClassName('clear-btn')[0].style.visibility = 'hidden';
        searchFunc(null, resultsContainer, false);
      } else {
        document.getElementsByClassName('clear-btn')[0].style.visibility = 'visible';
        searchFunc(tagFilterList, resultsContainer, true);
      }
    });
  });
  tagsheader.querySelector('a').addEventListener('click', (event) => {
    tagList.querySelectorAll('li > a').forEach((link) => {
      if (link.classList.contains('highlight')) {
        link.classList.remove('highlight');
        tagFilterList.splice(tagFilterList.indexOf(link.innerText), 1);
      }
    });
    event.target.style.visibility = 'hidden';
    searchFunc(null, resultsContainer, false);
  });
}

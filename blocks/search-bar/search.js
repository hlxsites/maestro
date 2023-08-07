import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import createTag from '../../utils/tag.js';
import ffetch from '../../scripts/ffetch.js';

async function fetchBlogArticleIndex() {
  const resp = await ffetch('/query-index.json')
    .filter((p) => p.template === 'insights')
    .all();
  return resp;
}

function decorateCard(hit) {
  const {
    title, description, image,
  } = hit;
  const path = hit.path.split('.')[0];
  const picture = createOptimizedPicture(image, title, false, [{ width: '750' }]);
  const pictureTag = picture.outerHTML;
  const html = `<div class="article-card-image">${pictureTag}</div>
      <div class="article-card-body">
        <h3>${title}</h3>
        <p>${description}</p>
      </div>`;
  return createTag('a', { href: path, class: 'article-card' }, html);
}

async function populateSearchResults(searchTerms, resultsContainer, tags = false) {
  const limit = 12;
  const terms = tags ? '' : searchTerms.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
  resultsContainer.innerHTML = '';

  if (tags || terms.length) {
    if (!window.blogIndex) {
      window.blogIndex = await fetchBlogArticleIndex();
    }
    const articles = window.blogIndex;
    const hits = [];
    let i = 0;
    for (; i < articles.length; i += 1) {
      const e = articles[i];
      const text = [e.title, e.description].join(' ').toLowerCase();
      if (tags) {
        let match = false;
        searchTerms.forEach((tag) => {
          if (e.tags.includes(tag)) {
            match = true;
          }
        });
        if (match) hits.push(e);
      } else if (terms.every((term) => text.includes(term))) {
        if (hits.length === limit) {
          break;
        }
        hits.push(e);
      }
    }
    hits.forEach((hit) => {
      const card = decorateCard(hit);
      resultsContainer.appendChild(card);
    });
    if (!hits.length) {
      resultsContainer.classList.add('no-Results');
      resultsContainer.parentElement.classList.remove('expand');
    } else {
      resultsContainer.classList.remove('no-Results');
      resultsContainer.classList.add('open');
      resultsContainer.parentElement.classList.add('expand');
    }
  }
}

async function fetchAllArticles(resultsContainer) {
  const limit = 12;
  resultsContainer.innerHTML = '';
  if (!window.blogIndex) {
    window.blogIndex = await fetchBlogArticleIndex();
  }
  const articles = window.blogIndex;
  const hits = [];
  let i = 0;
  for (; i < articles.length; i += 1) {
    if (hits.length === limit) {
      break;
    }
    hits.push(articles[i]);
  }
  hits.forEach((hit) => {
    const card = decorateCard(hit);
    resultsContainer.appendChild(card);
  });
  if (!hits.length) {
    resultsContainer.classList.add('no-Results');
    resultsContainer.parentElement.classList.remove('expand');
  } else {
    resultsContainer.classList.remove('no-Results');
    resultsContainer.classList.add('open');
    resultsContainer.parentElement.classList.add('expand');
  }
}

export default function onSearchInput(value, resultsContainer, tags) {
  if (value != null) populateSearchResults(value, resultsContainer, tags);
  else fetchAllArticles(resultsContainer);
}

import { buildBlock } from '../../scripts/lib-franklin.js';

function createTemplateBlock(section, blockName) {
  const block = buildBlock(blockName, { elems: [] });
  block.dataset.limit = 16;
  section.append(block);
}

export default async function loadEager(main) {
  const section = document.createElement('div');
  section.className = 'filter';
  const title = '<h2>Browse Insights</h2>';
  const insightsHeader = document.createElement('div');
  insightsHeader.classList.add('insightsheader');
  insightsHeader.innerHTML = title;
  section.append(insightsHeader);
  createTemplateBlock(section, 'search-bar');
  const resultsContainer = document.createElement('div');
  resultsContainer.setAttribute('id', 'results');
  resultsContainer.className = 'results';
  main.append(section);
  main.append(resultsContainer);
}

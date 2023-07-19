/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

/** create Columns Banner block */
const createColumnsBanner = (main, document) => {
  const selector = '.CustomerStoryPage__hero, .OverviewPage__banner, .AboutPage__hero, .AboutPage__secondary-banner';
  main.querySelectorAll(selector).forEach((banner) => {
    const bannerContentSelector = '.Banner__content, .AboutPage__secondary-banner-content';
    const bannerAdSelector = '.Banner__ad, .AboutPage__secondary-banner-ad ';
    const bannerContent = banner.querySelector(bannerContentSelector);
    const bannerAd = banner.querySelector(bannerAdSelector);

    const cells = [
      ['Columns (Banner)'],
      [bannerContent, bannerAd],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    banner.append(table);
  });
};

/** create Columns features block */
const createColumnsFeatures = (main, document) => {
  const selector = '.CustomerStoryPage__features-list, .OverviewPage__features-list, .AboutPage__features-list';
  main.querySelectorAll(selector).forEach((featureList) => {
    const featureWrapper = featureList.querySelectorAll('.Feature');

    const cells = [['Columns (Features)']];
    if (featureWrapper.length > 0) {
      const featureValues = Array.from(featureWrapper);
      const numRows = Math.ceil(featureValues.length / 3);

      for (let i = 0; i < numRows; i += 1) {
        const row = [];
        for (let j = i * 3; j < (i + 1) * 3; j += 1) {
          const feature = featureValues[j];
          if (feature) {
            row.push([feature]);
          } else {
            row.push(['']); // Add an empty cell if there are no more features
          }
        }
        cells.push(row);
      }
    }

    const table = WebImporter.DOMUtils.createTable(cells, document);
    featureList.append(table);
  });
};

/** create Secondary Banner Section */
const createSecondaryBannerSection = (main, document) => {
  main.querySelectorAll('.SecondaryBanner').forEach((secondaryBanner) => {
    secondaryBanner.prepend(document.createElement('hr'));
    const cells = [
      ['Section Metadata'],
      ['style', 'secondary-banner'],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    secondaryBanner.append(table);

    secondaryBanner.after(document.createElement('hr'));
  });
};

/** create Request Demo block */
const createRequestDemo = (main, document) => {
  main.querySelectorAll('.RequestDemoSection').forEach((demoSection) => {
    const requestDemoContent = demoSection.querySelector('.RequestDemoSection__content');

    const cells = [
      ['RequestDemo'],
      [requestDemoContent],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    demoSection.append(table);
  });
};

/** create Video block */
const createVideoBlock = (main, document) => {
  main.querySelectorAll('.FeaturesBanner__player-wrapper').forEach((videoBlock) => {
    const cells = [
      ['Video'],
      ['videoURL'],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    videoBlock.append(table);
  });
};

/** create Cards Features block */
const createCardsFeatures = (main, document) => {
  main.querySelectorAll('.FeaturesPage__features-list').forEach((featureList) => {
    const featureWrapper = featureList.querySelectorAll('.Feature');

    const cells = [['Cards (Features)']];
    featureWrapper.forEach((item) => {
      cells.push([item]);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    featureList.append(table);
  });
};

/** create Cards Insights block */
const createCardsInsights = (main, document) => {
  const selector = '.InsightsPage__cards, .InsightTagPage__cards';
  main.querySelectorAll(selector).forEach((cards) => {
    const featureWrapper = cards.querySelectorAll('.InsightCardsMasonry__card-outer');

    const cells = [['Cards (Insights)']];
    featureWrapper.forEach((item) => {
      cells.push([item]);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    cards.append(table);
  });
};

/** create Tabs block */
const createTabs = (main, document) => {
  main.querySelectorAll('.CustomerStoryPage__tabs  .Tabs__list-wrap').forEach((tabsList) => {
    const tabItem = tabsList.querySelectorAll('.Tabs__item p');

    const cells = [['Tabs']];
    tabItem.forEach((item) => {
      cells.push([item, 'videoURL']);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    tabsList.append(table);
  });

  WebImporter.DOMUtils.remove(main, [
    '.MediaTab',
  ]);
};

/** create ContactUs block */
const createContactUs = (main, document) => {
  main.querySelectorAll('.ContactSection').forEach((section) => {
    const contactUsContent = section.querySelector('.ContactSection__content');
    const contactUsForm = section.querySelector('.ContactSection__form-wrapper');
    const cells = [
      ['Contactus'],
      [contactUsContent, contactUsForm],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    section.append(table);
  });
};

/** create AuthorBio block */
const createAuthorBio = (main, document) => {
  main.querySelectorAll('.InsightAuthors').forEach((authorbio) => {
    const authorBioContent = authorbio.querySelector('.InsightAuthors__list');

    const cells = [
      ['Author-Bio'],
      [authorBioContent],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    authorbio.append(table);
  });
};

/** create Newsletter block */
const createNewsletter = (main, document) => {
  main.querySelectorAll('.InsightSubscribeBanner').forEach((section) => {
    const newsletterContent = section.querySelector('.InsightSubscribeBanner__content');
    const cells = [
      ['Newsletter'],
      [newsletterContent],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    section.append(table);
  });
};

export default {
  /**
     * Apply DOM operations to the provided document and return
     * the root element to be then transformed to Markdown.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @returns {HTMLElement} The root element to be transformed
     */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      '.AppBar',
      '.Footer',
    ]);

    // create the metadata block and append it to the main element
    createMetadata(main, document);
    createColumnsBanner(main, document);
    createColumnsFeatures(main, document);
    createSecondaryBannerSection(main, document);
    createRequestDemo(main, document);
    createVideoBlock(main, document);
    createCardsFeatures(main, document);
    createCardsInsights(main, document);
    createTabs(main, document);
    createContactUs(main, document);
    createAuthorBio(main, document);
    createNewsletter(main, document);

    return main;
  },

  /**
     * Return a path that describes the document being transformed (file name, nesting...).
     * The path is then used to create the corresponding Word document.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @return {string} The path
     */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};

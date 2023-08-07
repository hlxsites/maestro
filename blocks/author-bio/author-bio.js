import { getMetadata } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const authorName = getMetadata('authorname');
  const authorTitle = getMetadata('authortitle');
  const authorDescription = getMetadata('authordescription');
  const authorSocial = getMetadata('authorsocial');
  const authorImage = getMetadata('authorimage');
  const createdDate = getMetadata('createddate');

  block.innerHTML = ''; // Clear the block content

  if (block.classList.contains('detailed')) {
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('author-bio-inner');

    const title = document.createElement('h4');
    title.classList.add('author-bio-title');
    title.textContent = 'About the Author';
    innerDiv.appendChild(title);

    const list = document.createElement('ul');
    list.classList.add('author-bio-list');
    const listItem = document.createElement('li');
    listItem.classList.add('author-bio-list-item');

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('author-bio-header');
    const headerLeftDiv = document.createElement('div');
    headerLeftDiv.classList.add('author-bio-header-left');
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('author-bio-avatar');
    const avatarImg = new Image();
    avatarImg.src = authorImage;
    avatarDiv.appendChild(avatarImg);
    headerLeftDiv.appendChild(avatarDiv);
    headerDiv.appendChild(headerLeftDiv);

    const headerRightDiv = document.createElement('div');
    headerRightDiv.classList.add('author-bio-header-right');
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('author-bio-name');
    const firstName = authorName.substr(0, authorName.indexOf(' '));
    const lastName = authorName.substr(authorName.indexOf(' ') + 1);
    const firstNameSpan = document.createElement('span');
    firstNameSpan.textContent = firstName;
    nameDiv.append(firstNameSpan, document.createTextNode(` ${lastName}`));
    const positionDiv = document.createElement('div');
    positionDiv.classList.add('author-bio-position');
    const positionP = document.createElement('p');
    positionP.textContent = authorTitle;
    positionDiv.appendChild(positionP);
    headerRightDiv.append(nameDiv, positionDiv);
    headerDiv.appendChild(headerRightDiv);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('author-bio-description');
    const descriptionP = document.createElement('p');
    descriptionP.textContent = authorDescription;
    descriptionDiv.appendChild(descriptionP);
    const followWrapperDiv = document.createElement('div');
    followWrapperDiv.classList.add('author-bio-follow-wrapper');
    const followBtn = document.createElement('a');
    followBtn.classList.add('author-bio-follow-btn');
    followBtn.setAttribute('target', '_blank');
    followBtn.setAttribute('rel', 'noopener noreferrer');
    followBtn.setAttribute('href', authorSocial);
    // Create an SVG element
    const linkedinSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    linkedinSVG.setAttribute('width', '25');
    linkedinSVG.setAttribute('height', '24');
    linkedinSVG.setAttribute('viewBox', '0 0 25 24');

    // Create an image element and set the SVG file as its source
    const linkedinIcon = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    linkedinIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '../../styles/icons/linkedin.svg');
    linkedinIcon.setAttribute('height', '24');
    linkedinIcon.setAttribute('width', '25');

    // Append the image element to the SVG element
    linkedinSVG.appendChild(linkedinIcon);

    // Append the SVG to the follow button
    followBtn.appendChild(linkedinSVG);
    followBtn.innerHTML += ' Follow';
    followWrapperDiv.appendChild(followBtn);
    descriptionDiv.appendChild(followWrapperDiv);

    listItem.append(headerDiv, descriptionDiv);
    list.appendChild(listItem);
    innerDiv.appendChild(list);

    block.appendChild(innerDiv);
  } else {
    const wordsByWrapper = document.createElement('div');
    wordsByWrapper.classList.add('author-bio-words-by');
    const words = document.createElement('span');
    words.classList.add('author-words-by-words');
    words.textContent = 'Words by ';
    const name = document.createElement('span');
    name.classList.add('author-words-by-name');
    name.textContent = authorName; // removed the comma and space

    const title = document.createElement('span');
    title.classList.add('author-words-by-title');
    title.textContent = `${authorTitle}`;
    wordsByWrapper.append(words, name, title);

    const time = document.createElement('span');
    time.classList.add('author-words-by-time');
    time.textContent = createdDate;

    const shareWrapper = document.createElement('div');
    shareWrapper.classList.add('author-bio-share-wrapper');
    const shareText = document.createElement('span');
    shareText.textContent = 'Share';
    shareWrapper.append(shareText);

    // Twitter Icon
    const twitterIcon = new Image();
    twitterIcon.src = '../../styles/icons/twitter.svg';
    const twitterShare = document.createElement('a');
    twitterShare.classList.add('author-bio-share-btn');
    twitterShare.setAttribute('target', '_blank');
    twitterShare.setAttribute('rel', 'noopener noreferrer');
    twitterShare.setAttribute('aria-label', 'Twitter');
    twitterShare.setAttribute('href', `https://twitter.com/intent/tweet?text=${encodeURIComponent(authorDescription)}&url=${encodeURIComponent(authorSocial)}`);
    twitterShare.appendChild(twitterIcon);
    shareWrapper.append(twitterShare);

    // LinkedIn Icon
    const linkedInIcon = new Image();
    linkedInIcon.src = '../../styles/icons/linkedin.svg';
    const linkedInShare = document.createElement('a');
    linkedInShare.classList.add('author-bio-share-btn');
    linkedInShare.setAttribute('target', '_blank');
    linkedInShare.setAttribute('rel', 'noopener noreferrer');
    linkedInShare.setAttribute('aria-label', 'LinkedIn');
    linkedInShare.setAttribute('href', `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(authorSocial)}&title=${encodeURIComponent(authorTitle)}&summary=${encodeURIComponent(authorDescription)}&source=`);
    linkedInShare.appendChild(linkedInIcon);
    shareWrapper.append(linkedInShare);

    block.append(wordsByWrapper, time, shareWrapper);
  }
}

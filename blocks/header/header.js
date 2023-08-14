import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1280px)');
const isMobile = window.matchMedia('(max-width: 768px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = isMobile.matches ? nav.querySelector('.hamburger-mobile[aria-expanded="true"]') : nav.querySelector('.sidenav[aria-expanded="true"]');
    if (navSections) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, mobileNav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  mobileNav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable menu collapse on escape keypress
  if (!expanded) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function decorateNav(html) {
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = html;
  if (getMetadata('headerbgcolor')) {
    nav.style.backgroundColor = getMetadata('headerbgcolor');
  }
  const dNav = nav.querySelector('.navigation');
  const sideNav = nav.querySelector('.sidenav');
  const mobileNav = document.createElement('div');
  mobileNav.className = 'hamburger-mobile';
  if (dNav) {
    dNav.querySelectorAll(':scope > div > div > ul > li').forEach((navitem) => {
      if (navitem.innerText.includes(':')) {
        navitem.classList.add('button');
        navitem.innerText = navitem.innerText.replace(':', '');
      }
      navitem.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navitem.getAttribute('aria-expanded') === 'true';
          navitem.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }
  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
    </button>`;
  if (sideNav) {
    if (isMobile.matches) {
      mobileNav.appendChild(sideNav.querySelector(':scope > div > div > ul'));
      dNav.parentNode.appendChild(mobileNav);
      hamburger.addEventListener('click', () => toggleMenu(nav, mobileNav));
    } else {
      sideNav.querySelectorAll(':scope > div > div').forEach((div) => {
        const bgImage = div.querySelector('img');
        if (bgImage) {
          div.className = 'sidenav-left image-appear-animation';
          div.style.backgroundImage = `url('${bgImage.src}')`;
          sideNav.querySelector('picture').remove();
          const divText = document.createElement('div');
          divText.className = 'text-left';
          sideNav.querySelectorAll('p, h3, hr').forEach((item) => {
            divText.append(item);
          });
          div.appendChild(divText);
        } else div.className = 'sidenav-right';
      });
      dNav.parentNode.appendChild(sideNav);
      hamburger.addEventListener('click', () => toggleMenu(nav, sideNav));
    }
  }
  dNav.parentNode.appendChild(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  decorateIcons(nav);
  return nav;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    // decorate nav DOM
    const nav = decorateNav(html);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);
    window.matchMedia('(min-width: 768px)').addEventListener('change', (mediaQuery) => {
      if (mediaQuery.matches) {
        document.location.reload();
      }
    });
    window.matchMedia('(max-width: 767px)').addEventListener('change', (mediaQuery) => {
      if (mediaQuery.matches) {
        document.location.reload();
      }
    });
  }
}

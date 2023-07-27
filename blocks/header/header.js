import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1280px)');
const isMobile = window.matchMedia('(max-width: 768px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.hamburger-mobile');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.hamburger-mobile > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, mobileNav, dNav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');console.log(isDesktop.matches);
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(mobileNav, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation'); 
  // enable nav dropdown keyboard accessibility
 /* const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }*/
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
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
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;    
    const dNav = nav.querySelector('.navigation');
    const sideNav = nav.querySelector('.sidenav');
    const mobileNav = document.createElement('div');
    mobileNav.className = 'hamburger-mobile';    
    if (dNav) {
      dNav.querySelectorAll(':scope > div > div > ul > li').forEach((navitem) => {        
        if (dNav.querySelector('ul')) dNav.classList.add('nav-drop');
        if(navitem.innerText.includes(':')){
          navitem.classList.add('button');
          navitem.innerText = navitem.innerText.replace(':', '');
        }
        navitem.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navitem.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
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
     
    if(sideNav){
      if(isMobile.matches) {
        mobileNav.appendChild(sideNav.querySelector(':scope > div > div > ul'));
        dNav.parentNode.appendChild(mobileNav);
        hamburger.addEventListener('click', () => toggleMenu(nav, mobileNav, dNav));
      } else {
        sideNav.querySelectorAll(':scope > div > div').forEach((div) => {
          const bgImage = div.querySelector('img');
          if(bgImage){
            div.className = 'sidenav-left image-appear-animation';
            div.style.backgroundImage = `url('${bgImage.src}')`;
            sideNav.querySelector('picture').remove();
            const divText = document.createElement('div');
            divText.className = 'text-left';
            sideNav.querySelectorAll('p, h3').forEach(item => {
              if(item.innerText != '') 
                divText.append(item);                         
            });
            div.appendChild(divText);

          }
          else div.className = 'sidenav-right';
        });
        dNav.parentNode.appendChild(sideNav);
        hamburger.addEventListener('click', () => toggleMenu(nav, sideNav, dNav));
      }
    }     
    dNav.parentNode.appendChild(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize        
    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);
  }
}

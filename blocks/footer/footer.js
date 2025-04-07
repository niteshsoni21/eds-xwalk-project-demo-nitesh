import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  const lastChildDiv = document.querySelector('.columns-5-cols > div > div:last-child');

  if (lastChildDiv) {
    lastChildDiv.classList.add('contactus');
    const pictures = lastChildDiv.querySelectorAll('picture');

    pictures.forEach((picture) => {
      picture.classList.add('social');
    });
  }

  const lastSection = document.querySelector('.footer > div > div:last-child');
  lastSection.classList.add('copyright-bar');
}

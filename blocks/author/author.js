import { moveAttributes, moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const classes = ['title', 'subtitle', 'authorname', 'date', 'tags', 'social-facebook', 'social-linkedin', 'social-youtube', 'social-instagram'];

  const blockAuthor = document.createElement('div');
  const authorSocial = document.createElement('div');
  const ul = document.createElement('ul');

  block.querySelectorAll('p').forEach((ele, i) => {
    ele.classList.add(`author-${classes[i]}`);
  });

  [...block.children].forEach((row) => {
    row.querySelectorAll('p').forEach((ele) => {
      if (ele.className.includes('social-')) {
        ele.className = ele.className.replace('social-', '');
        const li = document.createElement('li');
        const href = document.createElement('a');
        const img = document.createElement('picture');
        href.setAttribute('href', ele.innerHTML);
        href.setAttribute('title', ele.className.replace('author-', ''));
        moveInstrumentation(ele, li);
        moveAttributes(ele, img);
        href.append(img);
        li.append(href);
        ul.append(li);
      } else {
        const propertydiv = document.createElement('div');
        const paragraphcontent = document.createElement('p');
        moveInstrumentation(ele, propertydiv);
        moveAttributes(ele, propertydiv);
        paragraphcontent.innerHTML = ele.innerHTML;
        propertydiv.appendChild(paragraphcontent);
        blockAuthor.appendChild(propertydiv);
      }
    });
    ul.classList.add('social-list');
    authorSocial.append(ul);
    authorSocial.classList.add('author-social');
    blockAuthor.appendChild(authorSocial);
  });
  block.innerHTML = blockAuthor.innerHTML;
}

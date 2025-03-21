import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const authorSocial = document.createElement('div');
  const blockAuthor = document.createElement('div');
  const ul = document.createElement('ul');
  let socialDiv = false;
  const classSuffix = 'author-';
  [...block.children].forEach((row) => {
    row.querySelectorAll('[data-aue-prop]').forEach((ele) => {
      const propClass = classSuffix.concat(ele.getAttribute('data-aue-prop').split('_')[1]);
      if (ele.getAttribute('data-aue-prop').startsWith('social')) {
        socialDiv = true;
        const li = document.createElement('li');
        li.classList.add(propClass);
        li.innerHTML = ele.innerHTML;
        moveInstrumentation(ele, li);
        ul.append(li);
      } else {
        const propertydiv = document.createElement('div');
        if (ele.getAttribute('data-aue-prop') !== 'authorContent_title') {
          propertydiv.innerHTML = `<p> ${ele.innerHTML} </p>`;
        } else {
          propertydiv.innerHTML = ele.innerHTML;
        }
        propertydiv.classList.add(propClass);
        blockAuthor.appendChild(propertydiv);
      }
      if (socialDiv) {
        authorSocial.append(ul);
        authorSocial.classList.add('author-social');
        blockAuthor.appendChild(authorSocial);
      }
    });
  });
  block.innerHTML = blockAuthor.innerHTML;
}

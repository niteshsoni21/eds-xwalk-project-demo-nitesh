import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.querySelectorAll('[data-aue-prop]').forEach((ele) => {
    const classSuffix = 'author-';
    const propClass = classSuffix.concat(ele.getAttribute('data-aue-prop').split('_')[1]);
    ele.classList.add(propClass);
  });

  const authorSocial = document.createElement('div');
  const blockAuthor = document.createElement('div');

  const ul = document.createElement('ul');
  let socialDiv = false;
  [...block.children].forEach((row) => {
    row.querySelectorAll('[data-aue-prop]').forEach((ele) => {
      if (ele.getAttribute('data-aue-prop').startsWith('social')) {
        socialDiv = true;
        const li = document.createElement('li');
        moveInstrumentation(ele, li);
        ul.append(li);
      } else {
        const propertydiv = document.createElement('div');
        propertydiv.innerHTML = `<p> ${row.children[1].innerHTML} </p>`;
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

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const blockAuthor = document.createElement('div');
  block.querySelectorAll('[data-aue-prop]').forEach((ele) => {
    const propClass = ele.getAttribute('data-aue-prop').split('_')[1];
    ele.classList.add(propClass);
  });

  const ul = document.createElement('ul');
  let socialDiv = false;
  [...block.children].forEach((row) => {
    row.querySelectorAll('[data-aue-prop]').forEach((ele) => {
      if (ele.getAttribute('data-aue-prop').startsWith('social')) {
        socialDiv = true;
        const li = document.createElement('li');
        moveInstrumentation(ele, li);
        ul.append(li);
        blockAuthor.append(ul);
      }
      if (socialDiv) {
        row.innerHTML = blockAuthor.innerHTML;
      }
    });
  });
}

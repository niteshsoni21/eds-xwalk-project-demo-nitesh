function expandItem(item) {
  const [, content] = item.children;
  content.style.height = `${content.scrollHeight}px`;
  const transitionEndCallback = () => {
    content.removeEventListener('transitionend', transitionEndCallback);
    content.style.height = 'auto';
  };
  content.addEventListener('transitionend', transitionEndCallback);
  item.classList.add('expanded');
}

function collapseItem(item) {
  const [, content] = item.children;
  content.style.height = `${content.scrollHeight}px`;
  requestAnimationFrame(() => {
    item.classList.remove('expanded');
    content.style.height = 0;
  });
}



export default function decorate(block) {
  const accordion = document.createElement('div');
  const accordionItem = document.createElement('div');
  [...block.children].forEach((row) => {
    accordionItem.classList.add('accordion-item');
    const accordionContent = document.createElement('div');
    const accordionTitle = document.createElement('div');
    accordionTitle.classList.add('accordion-item-header');
    accordionContent.classList.add('accordion-item-content');
    accordionTitle.innerHTML = row.children[0].innerText;
    accordionContent.innerHTML = row.children[1].innerHTML;
    accordionItem.appendChild(accordionTitle);
    accordionItem.appendChild(accordionContent);
    accordion.appendChild(accordionItem);

    accordionItem.addEventListener(('click', () => {
      if (!accordionItem.classList.contains('expanded')) {
        accordion.filter((i) => i.classList.contains('expanded')).forEach((i) => collapseItem(i));
        expandItem(accordionItem);
      } else {
        collapseItem(accordionItem);
      }
    }));
  });
  block.innerHTML = accordion.innerHTML;
}

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
    content.removeAttribute('style');
  });
}

export default function decorate(block) {
  const accordion = document.createElement('div');
  [...block.children].forEach((row) => {
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    const accordionContent = document.createElement('div');
    const accordionTitle = document.createElement('div');
    accordionTitle.classList.add('accordion-item-header');
    accordionContent.classList.add('accordion-item-content');
    accordionTitle.innerHTML = row.children[0].children[0].innerHTML;
    accordionContent.innerHTML = row.children[0].children[1].innerHTML;
    accordionItem.appendChild(accordionTitle);
    accordionItem.appendChild(accordionContent);
    accordion.appendChild(accordionItem);
  });
  block.innerHTML = accordion.innerHTML;

  document.querySelectorAll('.accordion-item').forEach((element) => {
    element.addEventListener('click', () => {
      if (!element.classList.contains('expanded')) {
        document.querySelectorAll('.accordion-item').forEach((ele) => {
          if (ele.classList.contains('expanded')) {
            collapseItem(element);
          }
        });
        expandItem(element);
      } else {
        collapseItem(element);
      }
    });
  });
}

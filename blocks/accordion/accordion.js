export default function decorate(block) {
  const accordion = document.createElement('div');
  const accordionItem = document.createElement('div');
  [...block.children].forEach((row) => {
    accordionItem.classList.add('accordion-item');
    const accordionContent = document.createElement('div');
    row.children.forEach((child) => {
      accordionContent.classList.add('accordion-item-header');
      child.innerHTML = '';
    });
    accordion.appendChild(accordionItem);
  });
  block.innerHTML = accordion.innerHTML;
}

export default function decorate(block) {
  const blockAuthor = document.createElement('div');
  [...block.children].forEach((row) => {
    row.innerHTML = row.innerHTML;
  });
  blockAuthor.innerHTML = block.innerHTML;
};
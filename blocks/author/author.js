export default function decorate(block) {
  const blockAuthor = document.createElement('div');
  [...block.children].forEach((row) => {
    console.log(row.innerHTML); 
  });
  blockAuthor.innerHTML = block.innerHTML;
}

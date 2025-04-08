export default function decorate(block) {
  [...block.children].forEach((row) => {
    const tagsBlock = document.createElement('div');
    row.classList.add('tagsblock-tags');
    const ul = document.createElement('ul');
    ul.classList.add('tags-list');
    ul.id = 'tags-list';
    row.querySelectorAll('p').forEach((ele) => {
      const tags = ele.innerHTML.split(',');
      tags.forEach((tag) => {
        const li = document.createElement('li');
        li.innerHTML = tag;
        ul.append(li);
      });
    });
    tagsBlock.append(ul);
    row.innerHTML = tagsBlock.innerHTML;
  });
}

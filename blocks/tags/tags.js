export default function decorate(block) {
  const tagClasses = ['tagsblock-tags', 'tagsblock-suggestedfeatures'];
  const ulClasses = ['tags-list', 'suggestedfeatures-list'];
  [...block.children].forEach((row, i) => {
    const tagsBlock = document.createElement('div');
    row.classList.add(tagClasses[i]);
    row.querySelectorAll('div>div').forEach((ele) => {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('tags-title');
      titleDiv.innerHTML = ele.innerHTML;
      tagsBlock.append(titleDiv);
    });
    const ul = document.createElement('ul');
    row.querySelectorAll('div>p').forEach((ele) => {
      const tags = ele.innerHTML.split(',');
      ul.classList.add(ulClasses[i]);
      ul.id = ulClasses[i];
      tags.forEach((tag) => {
        const li = document.createElement('li');
        li.innerHTML = tag;
        ul.append(li);
      });
      tagsBlock.append(ul);
    });
    row.innerHTML = tagsBlock.innerHTML;
  });
}

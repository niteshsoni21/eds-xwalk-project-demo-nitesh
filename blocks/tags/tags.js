function updateTagsList(ele, ul, ulClasses) {
  const tags = ele.innerHTML.split(',');
  ul.classList.add(ulClasses[i]);
  ul.id = ulClasses[i];
  tags.forEach((tag) => {
    const li = document.createElement('li');
    li.innerHTML = tag;
    ul.append(li);
  });
}

export default function decorate(block) {
  const tagClasses = ['tagsblock-tags', 'tagsblock-suggestedfeatures'];
  const ulClasses = ['tags-list', 'suggestedfeatures-list'];
  [...block.children].forEach((row, i) => {
    const tagsBlock = document.createElement('div');
    row.classList.add(tagClasses[i]);
    const ul = document.createElement('ul');
    let length = row.querySelectorAll('p').length;
    if (length < 2) {
      row.querySelectorAll('p').forEach((ele) => {
        updateTagsList(ele, ul, ulClasses);
      });
    } else {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('tags-title');
      titleDiv.innerHTML = row.querySelectorAll('p')[0].innerHTML;
      tagsBlock.append(titleDiv);
      updateTagsList(row.querySelectorAll('p')[1], ul, ulClasses);
    }
    tagsBlock.append(ul);
    });
    row.innerHTML = tagsBlock.innerHTML;
  });
}

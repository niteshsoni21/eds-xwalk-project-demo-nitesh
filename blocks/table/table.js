export default function decorate(block) {
  const table = document.createElement('table');
  table.classList.add('eds-table');

  const rows = Array.from(block.children);
  let theadCreated = false;
  const tbody = document.createElement('tbody');

  rows.forEach(rowBlock => {
    const children = rowBlock.children;
    if (children.length < 2) return;

    const isHeaderText = children[0]?.textContent?.trim().toLowerCase();
    const rowContent = children[1];
    const cells = Array.from(rowContent.querySelectorAll('p')).map(p => p.textContent.trim());

    if (isHeaderText === 'yes' && !theadCreated) {
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      cells.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);
      theadCreated = true;
    } else {
      const tr = document.createElement('tr');
      cells.forEach(text => {
        const td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
  });

  table.appendChild(tbody);

  block.textContent = '';
  block.appendChild(table);
}
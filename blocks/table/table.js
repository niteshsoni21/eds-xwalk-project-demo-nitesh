export default async function decorate(block) {
  const modelData = block.dataset.model;
  const model = JSON.parse(modelData);

  const table = document.createElement('table');
  table.classList.add('eds-table');

  const tableHead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  model.headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);
  table.appendChild(tableHead);

  const tableBody = document.createElement('tbody');
  model.rows.forEach((rowStr) => {
    const row = document.createElement('tr');
    const cells = rowStr.split('|');
    cells.forEach((cell) => {
      const td = document.createElement('td');
      td.textContent = cell;
      row.appendChild(td);
    });
    tableBody.appendChild(row);
  });
  table.appendChild(tableBody);

  block.appendChild(table);
}

// ===== race results =====
const form = document.getElementById('result-form');
const body = document.getElementById('results-body');

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
  });
}

// only run on pages that actually have the results form
if (form && body) {
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // stops the page from reloading

    const date = document.getElementById('r-date').value;
    const race = document.getElementById('r-race').value.trim();
    const result = document.getElementById('r-pos').value.trim();

    const row = document.createElement('tr');
    row.dataset.date = date;

    for (const text of [formatDate(date), result, race]) {
      const cell = document.createElement('td');
      cell.textContent = text;
      row.appendChild(cell);
    }

    const empty = body.querySelector('.empty');
    if (empty) empty.remove();

    body.appendChild(row);

    // newest result on top
    [...body.children]
      .sort((a, b) => b.dataset.date.localeCompare(a.dataset.date))
      .forEach((r) => body.appendChild(r));

    form.reset();
  });
}

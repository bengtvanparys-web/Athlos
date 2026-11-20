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

// ===== calendar =====
const calGrid = document.getElementById('cal-grid');

// only run on pages that have the calendar
if (calGrid) {
  const calTitle = document.getElementById('cal-title');
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // month that is shown. To start in January 2027, use: new Date(2027, 0, 1)
  let shown = new Date();
  shown.setDate(1);

  const pad = (n) => String(n).padStart(2, '0');
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  function renderCalendar() {
    const year = shown.getFullYear();
    const month = shown.getMonth();

    calTitle.textContent = shown.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    calGrid.replaceChildren(); // empty the grid

    // weekday names
    for (const name of WEEKDAYS) {
      const label = document.createElement('div');
      label.className = 'cal-weekday';
      label.textContent = name;
      calGrid.appendChild(label);
    }

    const offset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7; // fill complete weeks
    const todayISO = toISO(new Date());

    for (let i = 0; i < totalCells; i++) {
      const date = new Date(year, month, 1 - offset + i);
      const iso = toISO(date);

      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      cell.dataset.date = iso; // later: find the cell of a date to add events

      if (date.getMonth() !== month) cell.classList.add('other');
      if (iso === todayISO) {
        cell.classList.add('today');
        cell.setAttribute('aria-current', 'date');
      }

      const time = document.createElement('time');
      time.dateTime = iso;
      time.textContent = date.getDate();
      cell.appendChild(time);

      calGrid.appendChild(cell);
    }
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    shown.setMonth(shown.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    shown.setMonth(shown.getMonth() + 1);
    renderCalendar();
  });

  document.getElementById('cal-today').addEventListener('click', () => {
    shown = new Date();
    shown.setDate(1);
    renderCalendar();
  });

  renderCalendar();
}

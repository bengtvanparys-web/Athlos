// ===== race results =====
const form = document.getElementById('result-form');
const body = document.getElementById('results-body');

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
  });
}

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


// ===== Calendar =====
const trainings = {
  "2026-01-01": { type: "rest", text: "Restday" },
  "2026-01-02": { type: "train", text: "2h LSD<br>Zone 2" },
  "2026-01-03": { type: "train", text: "4h with intervals" },
  "2026-01-06": { type: "race", text: "Beachrace Koksijde" },
  "2026-01-07": { type: "race", text: "Beachrace Bredene" }
};

const calendar = document.getElementById("calendar");

const startDate = new Date("2026-01-01");
const endDate = new Date("2026-03-31");

let current = new Date(startDate);

let currentMonth = "";

while (current <= endDate) {

  const monthName = current.toLocaleDateString("nl-BE", {
    month: "long",
    year: "numeric"
  });

  if (monthName !== currentMonth) {
    currentMonth = monthName;

    calendar.innerHTML += `
      <h2 class="month-title">${monthName}</h2>
    `;
  }

  const weekStart = new Date(current);

  calendar.innerHTML += `
    <div class="week">
      <div class="day">Ma</div>
      <div class="day">Di</div>
      <div class="day">Wo</div>
      <div class="day">Do</div>
      <div class="day">Vr</div>
      <div class="day">Za</div>
      <div class="day">Zo</div>
  `;

  for (let i = 0; i < 7; i++) {

    const dateStr =
      current.getFullYear() + "-" +
      String(current.getMonth() + 1).padStart(2, "0") + "-" +
      String(current.getDate()).padStart(2, "0");

    const training = trainings[dateStr];

    if (training) {
      calendar.innerHTML += `
        <div class="slot ${training.type}">
          <strong>${current.getDate()}</strong><br>
          ${training.text}
        </div>
      `;
    } else {
      calendar.innerHTML += `
        <div class="slot">
          <strong>${current.getDate()}</strong>
        </div>
      `;
    }

    current.setDate(current.getDate() + 1);

    if (current > endDate) break;
  }

  calendar.innerHTML += `</div>`;
}

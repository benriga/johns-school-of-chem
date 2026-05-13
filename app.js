import { elements, categoryLabels } from "./elements.js";

const tableEl = document.getElementById("table");
const legendEl = document.querySelector(".legend");
const detailsEl = document.getElementById("details");
const detailsContent = detailsEl.querySelector(".details-content");
const detailsClose = document.getElementById("details-close");
const searchEl = document.getElementById("search");

function renderTable() {
  const frag = document.createDocumentFragment();

  for (const el of elements) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = `element cat-${el.category}`;
    cell.style.gridColumn = String(el.x);
    cell.style.gridRow = String(el.y);
    cell.dataset.number = String(el.n);
    cell.setAttribute("aria-label", `${el.name}, atomic number ${el.n}`);
    cell.innerHTML = `
      <span class="num">${el.n}</span>
      <span class="sym">${el.s}</span>
      <span class="nm">${el.name}</span>
    `;
    cell.addEventListener("click", () => selectElement(el));
    frag.appendChild(cell);
  }

  // Placeholders pointing into the f-block rows.
  const lanthPh = document.createElement("div");
  lanthPh.className = "placeholder";
  lanthPh.style.gridColumn = "3";
  lanthPh.style.gridRow = "6";
  lanthPh.textContent = "57–71";
  frag.appendChild(lanthPh);

  const actPh = document.createElement("div");
  actPh.className = "placeholder";
  actPh.style.gridColumn = "3";
  actPh.style.gridRow = "7";
  actPh.textContent = "89–103";
  frag.appendChild(actPh);

  // Visual gap above the f-block rows.
  const spacer = document.createElement("div");
  spacer.className = "spacer";
  spacer.style.gridColumn = "1 / -1";
  spacer.style.gridRow = "8";
  frag.appendChild(spacer);

  tableEl.appendChild(frag);
}

function renderLegend() {
  const frag = document.createDocumentFragment();
  for (const [key, label] of Object.entries(categoryLabels)) {
    const item = document.createElement("span");
    item.className = `swatch cat-${key}`;
    item.innerHTML = `<span class="dot"></span>${label}`;
    frag.appendChild(item);
  }
  legendEl.appendChild(frag);
}

let selectedNumber = null;

function selectElement(el) {
  selectedNumber = el.n;

  // Toggle selected outline.
  for (const node of tableEl.querySelectorAll(".element.selected")) {
    node.classList.remove("selected");
  }
  const cell = tableEl.querySelector(`[data-number="${el.n}"]`);
  if (cell) cell.classList.add("selected");

  detailsContent.innerHTML = `
    <h2><span>${el.s}</span> <span>${el.name}</span></h2>
    <span class="cat-pill cat-${el.category}">${categoryLabels[el.category] ?? el.category}</span>
    <dl>
      <dt>Atomic number</dt><dd>${el.n}</dd>
      <dt>Symbol</dt><dd>${el.s}</dd>
      <dt>Atomic mass</dt><dd>${formatMass(el.mass)}</dd>
      <dt>Category</dt><dd>${categoryLabels[el.category] ?? el.category}</dd>
      <dt>Group / Period</dt><dd>${groupPeriodLabel(el)}</dd>
    </dl>
  `;
  detailsEl.hidden = false;
}

function formatMass(m) {
  // Integer atomic masses are conventionally treated as "most stable isotope"
  // and shown in square brackets.
  if (Number.isInteger(m)) return `[${m}]`;
  return String(m);
}

function groupPeriodLabel(el) {
  if (el.category === "lanthanide") return `Lanthanide series (period 6)`;
  if (el.category === "actinide") return `Actinide series (period 7)`;
  return `Group ${el.x}, Period ${el.y}`;
}

detailsClose.addEventListener("click", () => {
  detailsEl.hidden = true;
  for (const node of tableEl.querySelectorAll(".element.selected")) {
    node.classList.remove("selected");
  }
  selectedNumber = null;
});

function applyFilter(query) {
  const q = query.trim().toLowerCase();
  const cells = tableEl.querySelectorAll(".element");

  if (!q) {
    cells.forEach((c) => c.classList.remove("dim"));
    return;
  }

  cells.forEach((c) => {
    const n = Number(c.dataset.number);
    const el = elements.find((e) => e.n === n);
    if (!el) return;
    const match =
      el.name.toLowerCase().includes(q) ||
      el.s.toLowerCase() === q ||
      el.s.toLowerCase().startsWith(q) ||
      String(el.n) === q;
    c.classList.toggle("dim", !match);
  });
}

searchEl.addEventListener("input", (e) => applyFilter(e.target.value));

// Keyboard: Escape closes the details panel.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !detailsEl.hidden) {
    detailsClose.click();
  }
});

renderTable();
renderLegend();

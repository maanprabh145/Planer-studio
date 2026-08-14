const recipeSelect = document.getElementById("recipeSelect");
const recipeEditor = document.getElementById("recipeEditor");
const loadPresetBtn = document.getElementById("loadPresetBtn");
const generateBtn = document.getElementById("generateBtn");
const exportPngBtn = document.getElementById("exportPngBtn");
const printPdfBtn = document.getElementById("printPdfBtn");
const imageInput = document.getElementById("imageInput");
const inspirationPreview = document.getElementById("inspirationPreview");
const plannerPage = document.getElementById("plannerPage");

function initApp() {
  loadPresetRecipe("desertBlend");
  bindEvents();
  renderPlanner(getRecipeFromEditor());
}

function bindEvents() {
  loadPresetBtn.addEventListener("click", () => loadPresetRecipe(recipeSelect.value));
  generateBtn.addEventListener("click", () => {
    try { renderPlanner(getRecipeFromEditor()); }
    catch (error) { alert("There is a problem in the recipe JSON. Please check it."); console.error(error); }
  });
  exportPngBtn.addEventListener("click", exportPNG);
  printPdfBtn.addEventListener("click", () => window.print());
  imageInput.addEventListener("change", handleImagePreview);
}

function loadPresetRecipe(name) {
  const recipe = RECIPES[name];
  recipeEditor.value = JSON.stringify(recipe, null, 2);
  renderPlanner(recipe);
}

function getRecipeFromEditor() { return JSON.parse(recipeEditor.value); }

function applyPalette(p) {
  document.documentElement.style.setProperty("--paper", p.paper);
  document.documentElement.style.setProperty("--text", p.text);
  document.documentElement.style.setProperty("--sage", p.sage);
  document.documentElement.style.setProperty("--terracotta", p.terracotta);
  document.documentElement.style.setProperty("--sand", p.sand);
  document.documentElement.style.setProperty("--accent", p.accent);
  document.documentElement.style.setProperty("--line", hexToRgba(p.text, 0.18));
}

function renderPlanner(recipe) {
  applyPalette(recipe.palette);
  plannerPage.innerHTML = `
    <div class="decor-layer">
      ${renderDecor(recipe)}
    </div>
    <div class="page-inner">
      <div class="top-kicker">Daily Planner</div>
      <div class="page-title-row">
        <div><h1 class="page-title">Today</h1></div>
        <div class="date-box"><div class="date-label">Date</div><div class="date-line"></div></div>
      </div>
      <div class="rule"></div>
      <div class="main-grid">
        ${recipe.sections.top3 ? renderTop3Panel() : ""}
        ${recipe.sections.todo ? renderTodoPanel() : ""}
      </div>
      <div class="bottom-grid">
        ${recipe.sections.schedule ? renderSchedulePanel() : ""}
        <div>
          ${recipe.sections.notes ? renderNotesPanel() : ""}
          ${recipe.sections.gratitude ? renderGratitudePanel() : ""}
        </div>
      </div>
      <div class="footer-note">Make room for what matters.</div>
    </div>
  `;
  plannerPage.querySelector(".page-title").style.fontFamily = recipe.typography.headingFont;
}

function renderDecor(recipe) {
  const p = recipe.palette;
  return `
    <div class="decor hero-cluster">${drawHeroCluster(p)}</div>
    <div class="decor sun-accent">${drawTopRightAccent(p)}</div>
    <div class="decor corner-dune">${drawBottomRightAccent(p)}</div>
    <div class="decor scatter" style="left: 265px; top: 208px; width: 22px; height: 22px;">${drawSparkle(p.accent)}</div>
    <div class="decor scatter" style="left: 610px; top: 352px; width: 26px; height: 26px;">${drawDotCluster(p.accent)}</div>
    <div class="decor scatter" style="left: 548px; bottom: 152px; width: 18px; height: 18px;">${drawSparkle(p.terracotta)}</div>
  `;
}

function renderTop3Panel() {
  return `
    <section class="panel">
      <div class="panel-header" style="background: var(--sage);">Today's Top 3</div>
      <div class="panel-body top3-list">
        ${[1,2,3].map((num, idx) => `
          <div class="top3-item">
            <div class="top3-badge" style="background:${["var(--sage)","var(--terracotta)","var(--sand)"][idx]};">${num}</div>
            <div class="top3-line"></div>
          </div>`).join("")}
      </div>
    </section>`;
}

function renderTodoPanel() {
  return `
    <section class="panel">
      <div class="panel-header" style="background: var(--terracotta);">To-Do List</div>
      <div class="panel-body todo">
        ${new Array(8).fill("").map(() => `<div class="todo-line"><div class="todo-circle"></div><div class="schedule-fill"></div></div>`).join("")}
      </div>
    </section>`;
}

function renderSchedulePanel() {
  const times = ["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM"];
  return `
    <section class="panel">
      <div class="panel-header" style="background: rgba(221,181,146,0.95); color: var(--text);">Schedule</div>
      <div class="panel-body schedule-list">
        ${times.map(time => `<div class="schedule-row"><div class="schedule-time">${time}</div><div class="schedule-fill"></div></div>`).join("")}
      </div>
    </section>`;
}

function renderNotesPanel() {
  return `<section class="panel" style="margin-bottom:22px;"><div class="panel-header" style="background: rgba(248,241,232,0.3); color: var(--text); border-bottom: 1px solid var(--line);">Notes</div><div class="panel-body lines">${new Array(7).fill("").map(() => `<div class="line"></div>`).join("")}</div></section>`;
}

function renderGratitudePanel() {
  return `<section class="panel"><div class="panel-header" style="background: rgba(214,147,104,0.22); color: var(--text); border-bottom: 1px solid var(--line);">Gratitude</div><div class="panel-body lines">${new Array(4).fill("").map(() => `<div class="line"></div>`).join("")}</div></section>`;
}

function drawHeroCluster(p) {
  return `<svg viewBox="0 0 210 610" width="210" height="610" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 540 C55 500, 98 486, 152 505 C174 512, 190 522, 202 535 L202 560 L15 560 Z" fill="${p.sand}" opacity="0.48"/>
      <path d="M8 566 C64 540, 118 544, 181 570" stroke="${p.accent}" stroke-width="2.2" fill="none" opacity="0.35"/>
      ${cactusSVG(85, 110, 78, p.sage)}
      ${cactusSVG(28, 325, 58, p.sage)}
      ${cactusSVG(118, 390, 48, p.sage)}
      <circle cx="150" cy="55" r="28" fill="${p.terracotta}" opacity="0.18"/>
      ${drawSunHalf(p.terracotta, p.accent, 115, 18, 74, 60)}
      ${drawDotClusterSVG(152, 196, p.accent)}
      ${drawSparkleSVG(150, 266, p.terracotta, 22)}
    </svg>`;
}

function drawTopRightAccent(p) {
  return `<svg viewBox="0 0 150 110" width="150" height="110" xmlns="http://www.w3.org/2000/svg">
      ${drawSunHalf(p.terracotta, p.accent, 32, 12, 86, 70)}
      ${drawArchSVG(98, 50, p.sand)}
      ${drawSparkleSVG(112, 18, p.accent, 16)}
    </svg>`;
}

function drawBottomRightAccent(p) {
  return `<svg viewBox="0 0 160 90" width="160" height="90" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 66 C40 32, 92 36, 152 60 L152 76 L6 76 Z" fill="${p.sand}" opacity="0.56"/>
      <path d="M16 74 C58 58, 105 58, 142 69" stroke="${p.accent}" stroke-width="2.2" fill="none" opacity="0.5"/>
      ${drawDotClusterSVG(112, 24, p.accent)}
    </svg>`;
}

function cactusSVG(x, y, h, color) {
  const w = h * 0.42;
  return `<g transform="translate(${x}, ${y})">
      <path d="M ${w*0.5} ${h} L ${w*0.5} ${h*0.16} Q ${w*0.5} 0 ${w*0.64} 0 Q ${w*0.78} 0 ${w*0.78} ${h*0.16} L ${w*0.78} ${h*0.36} Q ${w*0.78} ${h*0.22} ${w*0.91} ${h*0.22} Q ${w} ${h*0.22} ${w} ${h*0.34} L ${w} ${h*0.54} Q ${w} ${h*0.66} ${w*0.91} ${h*0.66} Q ${w*0.78} ${h*0.66} ${w*0.78} ${h*0.52} L ${w*0.78} ${h} Z M ${w*0.5} ${h*0.44} Q ${w*0.5} ${h*0.30} ${w*0.37} ${h*0.30} Q ${w*0.24} ${h*0.30} ${w*0.24} ${h*0.42} L ${w*0.24} ${h*0.58} Q ${w*0.24} ${h*0.70} ${w*0.11} ${h*0.70} Q 0 ${h*0.70} 0 ${h*0.58} L 0 ${h*0.38} Q 0 ${h*0.26} ${w*0.11} ${h*0.26} Q ${w*0.24} ${h*0.26} ${w*0.24} ${h*0.40} L ${w*0.24} ${h} Z" fill="${color}" opacity="0.92"/>
      <path d="M ${w*0.44} 12 L ${w*0.44} ${h-10}" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round"/>
      <path d="M ${w*0.60} 14 L ${w*0.60} ${h-12}" stroke="rgba(255,255,255,0.22)" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M 8 ${h+4} C ${w*0.3} ${h-2}, ${w*0.75} ${h-2}, ${w+8} ${h+4}" stroke="${color}" stroke-width="2.4" fill="none" opacity="0.55"/>
    </g>`;
}

function drawSunHalf(fill, stroke, x = 0, y = 0, w = 86, h = 66) {
  return `<g transform="translate(${x}, ${y})">
      <path d="M ${w*0.12} ${h*0.58} A ${w*0.38} ${h*0.38} 0 0 1 ${w*0.88} ${h*0.58} Z" fill="${fill}" opacity="0.9"/>
      <line x1="${w*0.16}" y1="${h*0.70}" x2="${w*0.84}" y2="${h*0.70}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
      <line x1="${w*0.24}" y1="${h*0.80}" x2="${w*0.76}" y2="${h*0.80}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
      <line x1="${w*0.34}" y1="${h*0.90}" x2="${w*0.68}" y2="${h*0.90}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
      ${[0.18,0.32,0.50,0.68,0.82].map(pos => `<line x1="${w*pos}" y1="${h*0.16}" x2="${w*pos}" y2="${h*0.01}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`).join("")}
      <line x1="${w*0.10}" y1="${h*0.24}" x2="${w*0.02}" y2="${h*0.12}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      <line x1="${w*0.90}" y1="${h*0.24}" x2="${w*0.98}" y2="${h*0.12}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    </g>`;
}

function drawArchSVG(x, y, color) {
  return `<g transform="translate(${x}, ${y})">
      <path d="M 0 24 A 12 12 0 0 1 24 24" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 5 24 A 7 7 0 0 1 19 24" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.55"/>
    </g>`;
}

function drawSparkle(color) {
  return `<svg viewBox="0 0 20 20" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.8 L12.2 7.8 L18.2 10 L12.2 12.2 L10 18.2 L7.8 12.2 L1.8 10 L7.8 7.8 Z" fill="${color}" opacity="0.9"/></svg>`;
}

function drawDotCluster(color) {
  return `<svg viewBox="0 0 26 26" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="7" r="2.1" fill="${color}" /><circle cx="13" cy="5" r="2.1" fill="${color}" /><circle cx="21" cy="9" r="2.1" fill="${color}" /><circle cx="9" cy="16" r="2.1" fill="${color}" /><circle cx="18" cy="18" r="2.1" fill="${color}" /></svg>`;
}

function drawSparkleSVG(x, y, color, size = 18) {
  return `<g transform="translate(${x}, ${y})"><path d="M ${size/2} 0 L ${size*0.66} ${size*0.34} L ${size} ${size/2} L ${size*0.66} ${size*0.66} L ${size/2} ${size} L ${size*0.34} ${size*0.66} L 0 ${size/2} L ${size*0.34} ${size*0.34} Z" fill="${color}" opacity="0.85"/></g>`;
}

function drawDotClusterSVG(x, y, color) {
  return `<g transform="translate(${x}, ${y})"><circle cx="4" cy="5" r="2.3" fill="${color}" /><circle cx="12" cy="3" r="2.3" fill="${color}" /><circle cx="18" cy="8" r="2.3" fill="${color}" /><circle cx="8" cy="14" r="2.3" fill="${color}" /><circle cx="16" cy="16" r="2.3" fill="${color}" /></g>`;
}

function handleImagePreview(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => { inspirationPreview.src = e.target.result; inspirationPreview.style.display = "block"; };
  reader.readAsDataURL(file);
}

async function exportPNG() {
  const canvas = await html2canvas(plannerPage, { backgroundColor: null, scale: 2, useCORS: true });
  const link = document.createElement("a");
  link.download = "planner-daily.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

initApp();

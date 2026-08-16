const recipeSelect = document.getElementById("recipeSelect");
const recipeEditor = document.getElementById("recipeEditor");
const loadPresetBtn = document.getElementById("loadPresetBtn");
const generateBtn = document.getElementById("generateBtn");
const exportPngBtn = document.getElementById("exportPngBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
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
  exportPdfBtn.addEventListener("click", exportPDF);
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
    <div class="decor-layer">${renderDecor(recipe)}</div>
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
    </div>`;
  plannerPage.querySelector(".page-title").style.fontFamily = recipe.typography.headingFont;
}
function renderDecor(recipe) {
  const p = recipe.palette;
  return `
    <div class="decor hero-cluster">${drawHeroCluster(p)}</div>
    <div class="decor sun-accent">${drawTopRightAccent(p)}</div>
    <div class="decor corner-dune">${drawBottomRightAccent(p)}</div>
    <div class="decor scatter" style="left:154px;top:104px;width:16px;height:16px;">${drawSparkle(p.accent)}</div>
    <div class="decor scatter" style="left:124px;top:924px;width:20px;height:20px;">${drawDotCluster(p.accent)}</div>`;
}
function renderTop3Panel() {
  return `<section class="panel"><div class="panel-header" style="background:var(--sage);">Today's Top 3</div><div class="panel-body top3-list">
    ${[1,2,3].map((num,idx)=>`<div class="top3-item"><div class="top3-badge" style="background:${["var(--sage)","var(--terracotta)","var(--sand)"][idx]};">${num}</div><div class="top3-line"></div></div>`).join("")}
  </div></section>`;
}
function renderTodoPanel() {
  return `<section class="panel"><div class="panel-header" style="background:var(--terracotta);">To-Do List</div><div class="panel-body todo">
    ${new Array(7).fill("").map(()=>`<div class="todo-line"><div class="todo-circle"></div><div class="schedule-fill"></div></div>`).join("")}
  </div></section>`;
}
function renderSchedulePanel() {
  const times=["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM"];
  return `<section class="panel"><div class="panel-header" style="background:rgba(221,181,146,.90);color:var(--text);">Schedule</div><div class="panel-body schedule-list">
    ${times.map(time=>`<div class="schedule-row"><div class="schedule-time">${time}</div><div class="schedule-fill"></div></div>`).join("")}
  </div></section>`;
}
function renderNotesPanel() {
  return `<section class="panel" style="margin-bottom:18px;"><div class="panel-header" style="background:rgba(154,160,139,.18);color:var(--text);border-bottom:1px solid var(--line);">Notes</div><div class="panel-body lines">${new Array(6).fill("").map(()=>`<div class="line"></div>`).join("")}</div></section>`;
}
function renderGratitudePanel() {
  return `<section class="panel"><div class="panel-header" style="background:rgba(214,147,104,.18);color:var(--text);border-bottom:1px solid var(--line);">Gratitude</div><div class="panel-body lines">${new Array(3).fill("").map(()=>`<div class="line"></div>`).join("")}</div></section>`;
}

/* ---------- Refined desert illustration system ---------- */
function drawHeroCluster(p) {
  return `<svg viewBox="0 0 172 780" width="172" height="780" xmlns="http://www.w3.org/2000/svg">
    <g opacity=".97">
      ${drawOrganicSun(p.terracotta,p.accent,20,32,96,78)}
      ${drawCactusOrganic(34,188,126,p.sage,1)}
      ${drawCactusOrganic(88,366,96,p.sage,.92)}
      ${drawCactusOrganic(18,548,82,p.sage,.88)}
      ${drawDuneGroup(p.sand,p.accent,4,650,160,90)}
      ${drawDotClusterSVG(116,284,p.accent,.82)}
      ${drawSparkleSVG(132,516,p.terracotta,18,.75)}
    </g>
  </svg>`;
}
function drawTopRightAccent(p) {
  return `<svg viewBox="0 0 130 100" width="130" height="100" xmlns="http://www.w3.org/2000/svg">
    ${drawOrganicSun(p.terracotta,p.accent,8,16,96,70)}
    ${drawArchSVG(94,52,p.sand)}
  </svg>`;
}
function drawBottomRightAccent(p) {
  return `<svg viewBox="0 0 150 92" width="150" height="92" xmlns="http://www.w3.org/2000/svg">
    ${drawDuneGroup(p.sand,p.accent,2,18,142,66)}
    ${drawSparkleSVG(118,14,p.accent,14,.62)}
  </svg>`;
}
function drawCactusOrganic(x,y,h,color,opacity=1) {
  const w=h*.46, cx=w*.52, left=cx-w*.18, right=cx+w*.16;
  const arm1Y=h*.43, arm2Y=h*.34;
  return `<g transform="translate(${x} ${y})" opacity="${opacity}">
    <path d="M ${left} ${h}
      C ${left-2} ${h*.82}, ${left-1} ${h*.58}, ${left+1} ${h*.18}
      C ${left+2} ${h*.06}, ${cx-4} 0, ${cx} 0
      C ${cx+7} 0, ${right} ${h*.07}, ${right} ${h*.18}
      L ${right} ${h*.36}
      C ${right} ${h*.42}, ${right+3} ${h*.45}, ${right+8} ${h*.45}
      C ${right+14} ${h*.45}, ${right+16} ${h*.40}, ${right+16} ${h*.33}
      L ${right+16} ${h*.28}
      C ${right+16} ${h*.21}, ${right+20} ${h*.17}, ${right+25} ${h*.17}
      C ${right+30} ${h*.17}, ${right+33} ${h*.22}, ${right+32} ${h*.29}
      L ${right+31} ${h*.39}
      C ${right+30} ${h*.53}, ${right+23} ${h*.60}, ${right+12} ${h*.60}
      C ${right+5} ${h*.60}, ${right+1} ${h*.57}, ${right} ${h*.55}
      L ${right} ${h}
      Z
      M ${left+1} ${h*.58}
      C ${left-2} ${h*.59}, ${left-6} ${h*.61}, ${left-11} ${h*.60}
      C ${left-18} ${h*.60}, ${left-22} ${h*.54}, ${left-22} ${h*.46}
      L ${left-22} ${h*.37}
      C ${left-22} ${h*.30}, ${left-18} ${h*.26}, ${left-13} ${h*.26}
      C ${left-8} ${h*.26}, ${left-5} ${h*.30}, ${left-5} ${h*.37}
      L ${left-5} ${h*.43}
      C ${left-5} ${h*.48}, ${left-2} ${h*.50}, ${left+1} ${h*.50}
      Z" fill="${color}"/>
    <path d="M ${cx-7} ${h*.10} C ${cx-8} ${h*.31}, ${cx-5} ${h*.58}, ${cx-7} ${h*.92}" stroke="rgba(255,255,255,.28)" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <path d="M ${cx+4} ${h*.12} C ${cx+3} ${h*.35}, ${cx+6} ${h*.61}, ${cx+4} ${h*.91}" stroke="rgba(255,255,255,.20)" stroke-width="1.35" fill="none" stroke-linecap="round"/>
    <path d="M ${left-26} ${h+4} C ${left-2} ${h-2}, ${right+18} ${h-2}, ${right+34} ${h+4}" stroke="${color}" stroke-width="2" fill="none" opacity=".48" stroke-linecap="round"/>
  </g>`;
}
function drawOrganicSun(fill,stroke,x,y,w,h) {
  const cx=w*.48, cy=h*.45, r=Math.min(w,h)*.20;
  const rays=[[-.02,-.31],[.18,-.28],[.35,-.17],[.43,.02],[.34,.20],[.15,.30],[-.07,.31],[-.26,.23],[-.39,.07],[-.34,-.13],[-.19,-.27]];
  return `<g transform="translate(${x} ${y})">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity=".92"/>
    ${rays.map(([rx,ry],i)=>{
      const x1=cx+rx*w*.72,y1=cy+ry*h*.72,x2=cx+rx*w*.98,y2=cy+ry*h*.98;
      return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${((x1+x2)/2 + (i%2?1.8:-1.2)).toFixed(1)} ${((y1+y2)/2).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${stroke}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".78"/>`;
    }).join("")}
    <path d="M ${w*.16} ${h*.76} C ${w*.36} ${h*.69}, ${w*.63} ${h*.70}, ${w*.82} ${h*.75}" stroke="${stroke}" stroke-width="1.8" fill="none" opacity=".62" stroke-linecap="round"/>
  </g>`;
}
function drawDuneGroup(fill,stroke,x,y,w,h) {
  return `<g transform="translate(${x} ${y})">
    <path d="M 0 ${h*.72} C ${w*.18} ${h*.40}, ${w*.32} ${h*.24}, ${w*.49} ${h*.30} C ${w*.61} ${h*.34}, ${w*.70} ${h*.56}, ${w} ${h*.64} L ${w} ${h*.82} L 0 ${h*.82} Z" fill="${fill}" opacity=".54"/>
    <path d="M ${w*.04} ${h*.74} C ${w*.26} ${h*.58}, ${w*.39} ${h*.42}, ${w*.55} ${h*.48} C ${w*.69} ${h*.53}, ${w*.77} ${h*.66}, ${w*.96} ${h*.70}" stroke="${stroke}" stroke-width="1.9" fill="none" opacity=".60" stroke-linecap="round"/>
    <path d="M ${w*.18} ${h*.86} C ${w*.36} ${h*.80}, ${w*.58} ${h*.80}, ${w*.78} ${h*.85}" stroke="${stroke}" stroke-width="1.3" fill="none" opacity=".28" stroke-linecap="round"/>
  </g>`;
}
function drawArchSVG(x,y,color) {
  return `<g transform="translate(${x} ${y})"><path d="M 0 22 C 2 8, 9 2, 16 2 C 23 2, 30 8, 32 22" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".72"/><path d="M 6 22 C 7 12, 11 8, 16 8 C 21 8, 25 12, 26 22" stroke="${color}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".48"/></g>`;
}
function drawSparkle(color) { return `<svg viewBox="0 0 20 20" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.6 C10.8 6.2 12.8 8.2 18.4 10 C12.8 11.8 10.8 13.8 10 18.4 C9.2 13.8 7.2 11.8 1.6 10 C7.2 8.2 9.2 6.2 10 1.6Z" fill="${color}" opacity=".88"/></svg>`; }
function drawDotCluster(color) { return `<svg viewBox="0 0 26 26" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="7" r="1.8" fill="${color}"/><circle cx="13" cy="5" r="2" fill="${color}"/><circle cx="21" cy="9" r="1.6" fill="${color}"/><circle cx="9" cy="16" r="1.7" fill="${color}"/><circle cx="18" cy="18" r="2" fill="${color}"/></svg>`; }
function drawSparkleSVG(x,y,color,size=18,opacity=.85) { return `<g transform="translate(${x} ${y})" opacity="${opacity}"><path d="M ${size/2} 0 C ${size*.57} ${size*.36}, ${size*.65} ${size*.43}, ${size} ${size/2} C ${size*.65} ${size*.57}, ${size*.57} ${size*.65}, ${size/2} ${size} C ${size*.43} ${size*.65}, ${size*.35} ${size*.57}, 0 ${size/2} C ${size*.35} ${size*.43}, ${size*.43} ${size*.36}, ${size/2} 0Z" fill="${color}"/></g>`; }
function drawDotClusterSVG(x,y,color,opacity=.8) { return `<g transform="translate(${x} ${y})" opacity="${opacity}"><circle cx="4" cy="5" r="1.8" fill="${color}"/><circle cx="11" cy="3" r="1.7" fill="${color}"/><circle cx="17" cy="8" r="2" fill="${color}"/><circle cx="8" cy="14" r="1.6" fill="${color}"/><circle cx="15" cy="16" r="1.9" fill="${color}"/></g>`; }

function handleImagePreview(event) {
  const file=event.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{ inspirationPreview.src=e.target.result; inspirationPreview.style.display="block"; };
  reader.readAsDataURL(file);
}
async function capturePlanner(scale=2) {
  if(document.fonts?.ready) await document.fonts.ready;
  return html2canvas(plannerPage,{backgroundColor:null,scale,useCORS:true,logging:false,width:816,height:1056,windowWidth:816,windowHeight:1056});
}
async function exportPNG() {
  const canvas=await capturePlanner(2);
  const link=document.createElement("a");
  link.download="planner-daily-v2.png";
  link.href=canvas.toDataURL("image/png");
  link.click();
}
async function exportPDF() {
  const canvas=await capturePlanner(2.2);
  const imgData=canvas.toDataURL("image/png",1.0);
  const { jsPDF }=window.jspdf;
  const pdf=new jsPDF({orientation:"portrait",unit:"pt",format:"letter",compress:true});
  pdf.addImage(imgData,"PNG",0,0,612,792,undefined,"FAST");
  pdf.save("planner-daily-v2.pdf");
}
function hexToRgba(hex,alpha) {
  const clean=hex.replace("#",""); const bigint=parseInt(clean,16);
  const r=(bigint>>16)&255,g=(bigint>>8)&255,b=bigint&255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
initApp();

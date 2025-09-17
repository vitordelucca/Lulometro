// Dados originais (porcentagens fornecidas)
const labels = [
  '05-Jul','07-Jul','08-Jul','09-Jul','10-Jul','11-Jul','12-Jul','14-Jul','15-Jul','16-Jul','17-Jul','18-Jul','19-Jul','21-Jul','22-Jul','23-Jul','24-Jul','25-Jul','28-Jul','29-Jul','30-Jul','31-Jul','01-Aug','04-Aug','05-Aug','06-Aug','07-Aug','08-Aug','11-Aug','12-Aug','13-Aug','14-Aug','15-Aug','18-Aug','19-Aug','20-Aug',
'21-Aug','22-Aug','25-Aug','26-Aug','27-Aug','28-Aug','29-Aug','01-Sep','02-Sep','03-Sep','04-Sep','05-Sep','08-Sep','09-Sep','10-Sep','11-Sep','12-Sep','15-Sep','16-Sep'
];

const raw = {
  ruim:   [47,46,45,44,44,43,43,43,43,43,43,45,44,46,45,44,43,42,42,42,43,41,40,40,40,40,39,39,39,39,39,40,40,39,39,38,39,39,39,38,38,37,39,38,39,39,40,39,37,36,36,36,37,37,37],
  regular:[24,26,25,26,25,25,24,24,25,25,26,24,25,26,27,27,27,28,29,30,29,28,28,29,28,28,29,29,28,28,29,27,28,27,27,28,26,27,27,28,27,28,29,29,30,31,31,30,29,30,29,29,28,27,26],
  bom:    [27,26,27,27,28,28,29,30,29,28,29,28,27,26,27,27,27,28,26,25,25,28,29,29,30,30,30,29,31,31,30,31,30,32,32,32,33,32,31,32,33,33,30,31,29,28,27,29,32,32,33,33,34,34,35]
};

function padToLabels(arr){
  const out = arr.slice(0, labels.length);
  while(out.length < labels.length) out.push(null);
  return out;
}

function padTo(arr, len){
  const out = arr.slice(0, len);
  while(out.length < len) out.push(null);
  return out;
}

// Moving average and prediction helpers
function movingAverage(data, windowSize = 3){
  const out = [];
  for(let i=0;i<data.length;i++){
    if(i < windowSize-1){ out.push(null); continue; }
    let sum = 0, count = 0;
    for(let j=i-windowSize+1;j<=i;j++){
      const v = data[j];
      if(v !== null && v !== undefined){ sum += Number(v); count++; }
    }
    out.push(count ? +(sum / count).toFixed(2) : null);
  }
  return out;
}

function linearRegressionPredict(data, count = 3){
  const points = data.map((v,i)=> (v===null||v===undefined)? null : {x:i,y:Number(v)}).filter(Boolean);
  if(points.length < 2) return Array(count).fill(null);
  const n = points.length;
  const sumX = points.reduce((s,p)=>s+p.x,0);
  const sumY = points.reduce((s,p)=>s+p.y,0);
  const sumXY = points.reduce((s,p)=>s+p.x*p.y,0);
  const sumXX = points.reduce((s,p)=>s+p.x*p.x,0);
  const slope = (n*sumXY - sumX*sumY) / (n*sumXX - sumX*sumX);
  const intercept = (sumY - slope*sumX) / n;
  const lastX = points[points.length-1].x;
  const preds = [];
  for(let i=1;i<=count;i++){
    const x = lastX + i;
    preds.push(+((slope*x + intercept).toFixed(2)));
  }
  return preds;
}

function makeGrad(ctx, h, colorTop, colorBottom){
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0, colorTop);
  g.addColorStop(1, colorBottom);
  return g;
}

// Compute dynamic y-axis bounds based on data, stacking and normalization
function computeYBounds(normalize=false, stacked=true){
  const ruim = raw.ruim.slice();
  const regular = raw.regular.slice();
  const bom = raw.bom.slice();

  // if normalize, recompute series as proportions (0-100)
  if(normalize){
    for(let i=0;i<labels.length;i++){
      const s = (Number(ruim[i]||0)+Number(regular[i]||0)+Number(bom[i]||0));
      if(s===0) continue;
      ruim[i] = +(ruim[i]*100/s).toFixed(1);
      regular[i] = +(regular[i]*100/s).toFixed(1);
      bom[i] = +(bom[i]*100/s).toFixed(1);
    }
  }

  // Helper to get numeric values only
  const values = (arr)=>arr.filter(v=>v!==null && v!==undefined).map(Number);

  if(stacked){
    // stacked: baseline 0 makes sense; max is the largest column total
    const totals = labels.map((_,i)=> (Number(ruim[i]||0)+Number(regular[i]||0)+Number(bom[i]||0)) );
    const max = Math.max(...totals);
    const min = 0; // stacked charts usually start at zero
    const pad = Math.max(2, (max - min) * 0.08);
    const yMin = Math.max(0, Math.floor(min - pad));
    const yMax = Math.min(100, Math.ceil(max + pad));
    return {yMin,yMax};
  } else {
    // non-stacked: zoom to series min/max with a small padding
    const all = values(ruim).concat(values(regular)).concat(values(bom));
    let min = Math.min(...all);
    let max = Math.max(...all);
    // if all equal (rare), give small window
    if(min===max){ min = Math.max(0, min - 2); max = Math.min(100, max + 2); }
    const pad = Math.max(2, (max - min) * 0.12);
    const yMin = Math.max(0, Math.floor(min - pad));
    const yMax = Math.min(100, Math.ceil(max + pad));
    return {yMin,yMax};
  }
}

// Events annotations (date->label). Edit as needed.
const EVENTS = [
  { date: '09-Jul', title: 'Trump anuncia tarifa ao Brasil' },
  { date: '17-Jul', title: 'Pronunciamento Lula: Brasil Soberano' },
  { date: '30-Jul', title: 'EUA sanciona Moraes' },
  { date: '04-Aug', title: 'Prisão domiciliar a Bolsonaro' },
  { date: '06-Aug', title: 'Tarifa entra em vigor' },
  { date: '12-Aug', title: 'IPCA 0,26%' },
  { date: '28-Aug', title: 'Operação PCC' },
  { date: '02-Sep', title: 'Julgamento Bolsonaro' },
  { date: '04-Sep', title: 'Gás do Povo' },
  { date: '06-Sep', title: 'Pronunciamento Lula: Independência' },
  { date: '07-Sep', title: 'Protesto pela anistia' },
  { date: '10-Sep', title: 'IPCA -0,11' },
  { date: '11-Sep', title: 'Bolsonaro condenado' }
];

// UI feature flags
let showMovingAvg = false;
let showPredictions = false;
let showEvents = false;
const MA_WINDOW = 3;
const PRED_COUNT = 3;

function getCurrentLabels(){
  if(!showPredictions) return labels;
  const ext = [];
  for(let i=1;i<=PRED_COUNT;i++) ext.push(`+${i}`);
  return labels.concat(ext);
}

// Dataset configuration constants
const DATASET_COLORS = {
  ruim: {
    primary: 'rgba(239,71,111,0.95)',
    background: ['rgba(239,71,111,0.18)', 'rgba(239,71,111,0.03)'],
    point: 'rgba(239,71,111,1)',
    movingAvg: 'rgba(239,71,111,0.8)',
    prediction: 'rgba(239,71,111,0.7)'
  },
  regular: {
    primary: 'rgba(255,209,102,0.95)',
    background: ['rgba(255,209,102,0.18)', 'rgba(255,209,102,0.03)'],
    point: 'rgba(255,209,102,1)',
    movingAvg: 'rgba(255,209,102,0.85)',
    prediction: 'rgba(255,209,102,0.75)'
  },
  bom: {
    primary: 'rgba(6,214,160,0.95)',
    background: ['rgba(6,214,160,0.18)', 'rgba(6,214,160,0.03)'],
    point: 'rgba(6,214,160,1)',
    movingAvg: 'rgba(6,214,160,0.85)',
    prediction: 'rgba(6,214,160,0.75)'
  }
};

const DATASET_LABELS = {
  ruim: 'Ruim / Péssimo',
  regular: 'Regular',
  bom: 'Ótimo / Bom'
};

// Create base dataset
function createBaseDataset(type, data, canvas, height) {
  const colors = DATASET_COLORS[type];
  return {
    label: DATASET_LABELS[type],
    data: data,
    borderColor: colors.primary,
    backgroundColor: makeGrad(canvas, height, colors.background[0], colors.background[1]),
    pointBackgroundColor: colors.point,
    stack: 'stack1',
    type: 'line'
  };
}

// Create moving average dataset
function createMovingAvgDataset(type, data) {
  const colors = DATASET_COLORS[type];
  return {
    label: `Média móvel — ${DATASET_LABELS[type]}`,
    data: data,
    borderColor: colors.movingAvg,
    backgroundColor: 'transparent',
    pointRadius: 0,
    borderDash: [6, 6],
    type: 'line'
  };
}

// Create prediction dataset
function createPredictionDataset(type, data) {
  const colors = DATASET_COLORS[type];
  return {
    label: `Projeção — ${DATASET_LABELS[type]}`,
    data: data,
    borderColor: colors.prediction,
    backgroundColor: 'transparent',
    borderDash: [2, 4],
    pointRadius: 0,
    type: 'line'
  };
}

function buildDatasets(){
  const canvas = document.getElementById('chart');
  const c = canvas.getContext('2d');
  const h = 420;
  const datasets = [];

  const ruim = raw.ruim.slice();
  const regular = raw.regular.slice();
  const bom = raw.bom.slice();
  const currentLabels = getCurrentLabels();

  // Base datasets
  datasets.push(createBaseDataset('ruim', padTo(ruim, currentLabels.length), c, h));
  datasets.push(createBaseDataset('regular', padTo(regular, currentLabels.length), c, h));
  datasets.push(createBaseDataset('bom', padTo(bom, currentLabels.length), c, h));

  // Moving average datasets
  if (showMovingAvg){
    const mmRuim = movingAverage(ruim, MA_WINDOW);
    const mmReg = movingAverage(regular, MA_WINDOW);
    const mmBom = movingAverage(bom, MA_WINDOW);
    
    datasets.push(createMovingAvgDataset('ruim', padTo(mmRuim, currentLabels.length)));
    datasets.push(createMovingAvgDataset('regular', padTo(mmReg, currentLabels.length)));
    datasets.push(createMovingAvgDataset('bom', padTo(mmBom, currentLabels.length)));
  }

  // Prediction datasets
  if (showPredictions){
    const predsR = linearRegressionPredict(ruim, PRED_COUNT);
    const predsG = linearRegressionPredict(regular, PRED_COUNT);
    const predsB = linearRegressionPredict(bom, PRED_COUNT);

    function predictionSeries(base, preds){
      const out = Array(base.length).fill(null);
      out[base.length-1] = base[base.length-1];
      return out.concat(preds);
    }

    datasets.push(createPredictionDataset('ruim', predictionSeries(ruim, predsR)));
    datasets.push(createPredictionDataset('regular', predictionSeries(regular, predsG)));
    datasets.push(createPredictionDataset('bom', predictionSeries(bom, predsB)));
  }

  return datasets;
}

// Initial state (fixed: linhas, sem normalizar)
let isStacked = false;
let isNormalized = false;

// Chart instance
let myChart = null;

// Custom events annotation plugin
const eventsPlugin = {
  id: 'eventsOverlay',
  afterDraw(chart){
    if(!showEvents) return;
    const {ctx, chartArea:{top,bottom}, scales:{x}} = chart;
    const currentLabels = chart.data.labels;
    const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.save();
    ctx.strokeStyle = isLightTheme ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
    ctx.fillStyle = isLightTheme ? '#1e293b' : '#e6eef6';
    ctx.font = '600 10px Inter, Arial, sans-serif';
    ctx.textBaseline = 'top';
    EVENTS.forEach((ev, index) => {
      const idx = currentLabels.indexOf(ev.date);
      if(idx === -1) return;
      const xPos = x.getPixelForValue(idx);
      ctx.beginPath();
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.stroke();
      // label box with collision avoidance
      const padding = 4;
      const text = ev.title;
      const textW = ctx.measureText(text).width;
      const boxWidth = textW + padding * 2;
      const boxHeight = 16;
      
      // Alternate label positions to reduce collisions
      const alternatePosition = index % 2 === 0;
      const by = alternatePosition ? top + 4 : top + 24;
      
      // Ensure box stays within chart bounds
      const bx = Math.min(Math.max(xPos - (textW/2 + padding), 4), chart.width - boxWidth - 4);
      
      ctx.fillStyle = isLightTheme ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.35)';
      ctx.fillRect(bx, by, boxWidth, boxHeight);
      ctx.fillStyle = isLightTheme ? '#1e293b' : '#e6eef6';
      ctx.fillText(text, bx + padding, by + 2);
    });
    ctx.restore();
  }
};

// Get theme-aware chart colors
function getThemeColors() {
  const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    ticks: isLightTheme ? '#334155' : '#cbd5e1',
    grid: isLightTheme ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.03)',
    tooltipBg: isLightTheme ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)',
    tooltipText: isLightTheme ? '#0f172a' : '#e6eef6'
  };
}

// Initialize chart
function initChart() {
  const canvas = document.getElementById('chart');
  
  // compute initial y-bounds
  const initialBounds = computeYBounds(isNormalized, isStacked);
  const themeColors = getThemeColors();

  const config = {
    type: 'line',
    data: {labels: getCurrentLabels(), datasets: buildDatasets()},
    plugins: [{
      id: 'eventsOverlay',
      afterDraw: eventsPlugin?.afterDraw || (()=>{})
    }],
    options: {
      maintainAspectRatio:false,
      animation: {
        duration: 600,
        easing: 'easeOutQuart'
      },
      transitions: {
        active: { animation: { duration: 300 } },
        show: { animations: { x: {duration: 500}, y: {duration: 500} } },
        hide: { animations: { x: {duration: 300}, y: {duration: 300} } }
      },
      interaction:{mode:'index',intersect:false},
      stacked:isStacked,
      plugins:{
        legend:{display:false}, // We use a custom legend
        tooltip:{
          backgroundColor: themeColors.tooltipBg,
          titleColor: themeColors.tooltipText,
          bodyColor: themeColors.tooltipText,
          borderColor: themeColors.grid,
          borderWidth: 1,
          callbacks: {
            label: function(ctx){
              const value = ctx.raw;
              return ctx.dataset.label + ': ' + (value===null? '—' : value + '%');
            }
          }
        },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
        }
      },
      scales:{
        x:{
          grid:{display:false},
          ticks:{color:themeColors.ticks}
        },
        y:{
          stacked:isStacked,
          min: initialBounds.yMin,
          max: initialBounds.yMax,
          ticks:{color:themeColors.ticks,callback:function(v){return v + '%'}},
          grid:{color:themeColors.grid}
        }
      },
      elements: {line:{tension:0.35, borderWidth:2},point:{radius:3}}
    }
  };

  myChart = new Chart(canvas, config);
  window.myChart = myChart; // Expose globally
  
  // Initialize legend state
  syncLegend();
  document.querySelectorAll('.legend-item').forEach(el=>{
    const i = Number(el.getAttribute('data-ds'));
    if(Number.isFinite(i)) el.setAttribute('aria-pressed', String(myChart.isDatasetVisible(i)));
  });
}

// Update chart colors for theme
function updateChartTheme() {
  if (!myChart) return;
  const themeColors = getThemeColors();
  
  // Update scale colors
  myChart.options.scales.x.ticks.color = themeColors.ticks;
  myChart.options.scales.y.ticks.color = themeColors.ticks;
  myChart.options.scales.y.grid.color = themeColors.grid;
  
  // Update tooltip colors
  myChart.options.plugins.tooltip.backgroundColor = themeColors.tooltipBg;
  myChart.options.plugins.tooltip.titleColor = themeColors.tooltipText;
  myChart.options.plugins.tooltip.bodyColor = themeColors.tooltipText;
  myChart.options.plugins.tooltip.borderColor = themeColors.grid;
  
  myChart.update('none');
}

// Helper to refresh datasets and y-bounds
function refreshChart(){
  if (!myChart) return;
  
  // Preserve current visibility per dataset index
  const visibility = myChart.data.datasets.slice(0,3).map((_, i)=> myChart.isDatasetVisible(i));
  myChart.data.labels = getCurrentLabels();
  myChart.data.datasets = buildDatasets();
  // recompute bounds depending on current mode
  const bounds = computeYBounds(isNormalized, isStacked);
  myChart.options.scales.y.min = bounds.yMin;
  myChart.options.scales.y.max = bounds.yMax;
  myChart.options.scales.y.stacked = isStacked;
  myChart.options.scales.x.stacked = isStacked;
  myChart.options.stacked = isStacked;
  // Restore visibility
  visibility.forEach((v,i)=> myChart.setDatasetVisibility(i, v !== false));
  myChart.update();
}

// (globals exposed later after declarations)

// Sync custom legend UI with current visibility
function syncLegend(){
  document.querySelectorAll('.legend-item').forEach(el=>{
    const i = Number(el.getAttribute('data-ds'));
    if(Number.isFinite(i) && myChart){
      const visible = myChart.isDatasetVisible(i);
      el.classList.toggle('disabled', !visible);
    }
  });
}

// Toggle datasets via custom legend (click + keyboard)
function onLegendToggle(el){
  const i = Number(el.getAttribute('data-ds'));
  if(!Number.isFinite(i) || !myChart) return;
  const visible = myChart.isDatasetVisible(i);
  myChart.setDatasetVisibility(i, !visible);
  el.classList.toggle('disabled', visible);
  // update aria-pressed to reflect new state
  el.setAttribute('aria-pressed', String(!visible));
  refreshChart();
  syncLegend();
}

// Reset button
function resetChart(){
  if (!myChart) return;
  // show all datasets
  myChart.data.datasets.forEach((_, i)=> myChart.setDatasetVisibility(i, true));
  if (typeof myChart.resetZoom === 'function') {
    myChart.resetZoom();
  }
  refreshChart();
  syncLegend();
}

// Helper: series arrays for current state
function getSeries(){
  return {
    ruim: padToLabels(raw.ruim.slice()),
    regular: padToLabels(raw.regular.slice()),
    bom: padToLabels(raw.bom.slice())
  };
}

// Export CSV (visão atual)
function exportCSV(){
  const s = getSeries();
  const header = ['Data','Ruim / Péssimo','Regular','Ótimo / Bom'];
  // proper CSV quoting and Excel BOM (UTF-8) for better compatibility
  const escape = v => {
    if(v === null || v === undefined) return '';
    const str = String(v);
    if(str.includes('"') || str.includes(',') || str.includes('\n')){
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };
  const rows = [header.map(escape).join(',')];
  for(let i=0;i<labels.length;i++){
    const r = [labels[i], s.ruim[i] ?? '', s.regular[i] ?? '', s.bom[i] ?? ''];
    rows.push(r.map(escape).join(','));
  }
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + rows.join('\n')], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aprovacao-lula.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Export PNG com título, legenda e fonte
function exportPNG(){
  if (!myChart) return;
  
  const canvas = document.getElementById('chart');
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(1, Math.floor(rect.width));
  const cssH = Math.max(1, Math.floor(rect.height));
  const DPR = 2; // export at 2x scale
  const headerH = 80; // Reduced header height
  const footerH = 60; // Reduced footer height

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = cssW * DPR;
  tempCanvas.height = (cssH + headerH + footerH) * DPR;
  const ctx = tempCanvas.getContext('2d');
  ctx.scale(DPR, DPR);

  // fundo
  ctx.fillStyle = '#0f1724';
  ctx.fillRect(0, 0, cssW, cssH + headerH + footerH);

  // textos de topo
  const title = (document.querySelector('h1')?.textContent || 'Aprovação — gráfico').trim();
  const subtitle = (document.querySelector('.lead')?.textContent || '').trim();
  ctx.fillStyle = '#e6eef6';
  ctx.textBaseline = 'top';
  ctx.font = '700 24px Inter, Arial, sans-serif'; // Adjusted font size
  ctx.fillText(title, 16, 12); // Adjusted positioning
  if(subtitle){
    ctx.fillStyle = '#9aa4b2';
    ctx.font = '400 16px Inter, Arial, sans-serif'; // Adjusted font size
    ctx.fillText(subtitle, 16, 12 + 24 + 16); // Adjusted positioning
  }

  // chart
  ctx.drawImage(canvas, 0, headerH, cssW, cssH);

  // legenda no rodapé (direita)
  const items = myChart.data.datasets.map((ds, i)=>({
    label: ds.label,
    color: ds.borderColor,
    visible: myChart.isDatasetVisible(i)
  }));
  let x = 16;
  const baseY = headerH + cssH + 12;
  ctx.textBaseline = 'middle';
  ctx.font = '600 14px Inter, Arial, sans-serif'; // Adjusted font size
  items.forEach(it=>{
    ctx.globalAlpha = it.visible? 1 : 0.45;
    // swatch
    ctx.fillStyle = it.color;
    ctx.fillRect(x, baseY, 10, 10); // Smaller swatch
    x += 10 + 5;
    // label
    ctx.fillStyle = '#e6eef6';
    ctx.fillText(it.label, x, baseY + 5);
    x += ctx.measureText(it.label).width + 12; // Reduced spacing
  });
  ctx.globalAlpha = 1;

  // CTA no rodapé (direita)
  const follow = 'Siga @vitor_dlucca';
  ctx.font = '700 12px Inter, Arial, sans-serif'; // Adjusted font size
  ctx.fillStyle = '#e6eef6';
  const followWidth = ctx.measureText(follow).width;
  const bottomY = headerH + cssH + footerH - 20; // Adjusted positioning
  ctx.fillText(follow, cssW - 16 - followWidth, bottomY); // Use cssW instead of tempCanvas.width

  // download
  const url = tempCanvas.toDataURL('image/png', 1.0);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aprovacao-lula.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Function to update chart with new data (used by date filter)
function updateChartWithData(newLabels, newData) {
  if (!myChart) return;
  
  // Update chart data
  myChart.data.labels = newLabels;
  myChart.data.datasets[0].data = padTo(newData.ruim, newLabels.length);
  myChart.data.datasets[1].data = padTo(newData.regular, newLabels.length);
  myChart.data.datasets[2].data = padTo(newData.bom, newLabels.length);
  myChart.update();
}

// Responsive redraw on resize to recreate gradients and recompute bounds
let resizeTimeout;
function handleResize(){
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(()=>{
    refreshChart();
    syncLegend();
  },120);
}

  // Make data globally accessible for other modules
  window.labels = labels;
  window.raw = raw;
  window.updateChartWithData = updateChartWithData;
  window.computeYBounds = computeYBounds;
  window.buildDatasets = buildDatasets;
  // Expose functions for other modules
  window.refreshChart = refreshChart;
  window.updateChartTheme = updateChartTheme;
  window.exportPNG = exportPNG;
  window.exportCSV = exportCSV;
  window.resetChart = resetChart;
  window.syncLegend = syncLegend;
  window.myChart = myChart;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Initialize chart
    initChart();
    
    // Setup event listeners
    document.querySelectorAll('.legend-item').forEach(el=>{
      el.addEventListener('click', ()=> onLegendToggle(el));
      el.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' '){ 
          e.preventDefault(); 
          onLegendToggle(el); 
        }
      });
  });
  
  const resetBtn = document.getElementById('reset');
  const maBtn = document.getElementById('ma-toggle');
  const predBtn = document.getElementById('pred-toggle');
  const evBtn = document.getElementById('events-toggle');
  if (resetBtn) resetBtn.addEventListener('click', resetChart);
  if (maBtn) maBtn.addEventListener('click', ()=>{
    showMovingAvg = !showMovingAvg;
    maBtn.setAttribute('aria-pressed', String(showMovingAvg));
    refreshChart();
  });
  if (predBtn) predBtn.addEventListener('click', ()=>{
    showPredictions = !showPredictions;
    predBtn.setAttribute('aria-pressed', String(showPredictions));
    refreshChart();
  });
  if (evBtn) evBtn.addEventListener('click', ()=>{
    showEvents = !showEvents;
    evBtn.setAttribute('aria-pressed', String(showEvents));
    refreshChart();
  });
  
  window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error('Failed to initialize chart:', error);
    // In a production environment, you might want to call showError('Falha ao inicializar o gráfico');
  }
});

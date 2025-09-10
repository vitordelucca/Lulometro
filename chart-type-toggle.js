// Chart type toggle functionality
class ChartTypeToggle {
  constructor() {
    this.currentType = 'line'; // Default to line chart
    this.init();
  }

  init() {
    this.createToggle();
    this.attachEventListeners();
  }

  createToggle() {
    // Create chart type toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'chart-type-toggle';
    toggleButton.className = 'toolbar-button';
    toggleButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3V19H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 15L10 10L13 13L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Gráfico de Barras
    `;
    
    // Add to toolbar
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      // Insert after the data table toggle
      const dataTableToggle = document.getElementById('data-table-toggle');
      if (dataTableToggle) {
        toolbar.insertBefore(toggleButton, dataTableToggle.nextSibling);
      } else {
        toolbar.appendChild(toggleButton);
      }
    }
  }

  attachEventListeners() {
    const toggleButton = document.getElementById('chart-type-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => this.toggleChartType());
    }
  }

  toggleChartType() {
    this.currentType = this.currentType === 'line' ? 'bar' : 'line';
    this.updateChartType();
    this.updateButtonText();
  }

  updateChartType() {
    // Update the chart with new type
    if (window.myChart) {
      // Destroy existing chart
      window.myChart.destroy();
      
      // Get canvas and context
      const canvas = document.getElementById('chart');
      const ctx = canvas.getContext('2d');
      
      // Recreate chart with new type
      const config = this.createChartConfig();
      window.myChart = new Chart(ctx, config);
      
      // Update the global refreshChart function to work with the new chart
      window.refreshChart = () => {
        // Preserve current visibility per dataset index
        const visibility = window.myChart.data.datasets.map((_, i)=> window.myChart.isDatasetVisible(i));
        const isStacked = this.currentType === 'bar';
        window.myChart.data.datasets = this.buildDatasets();
        // Recompute bounds and stacking for current type
        if (typeof window.computeYBounds === 'function') {
          const bounds = window.computeYBounds(false, isStacked);
          window.myChart.options.scales.y.min = bounds.yMin;
          window.myChart.options.scales.y.max = bounds.yMax;
          window.myChart.options.scales.y.stacked = isStacked;
          window.myChart.options.scales.x.stacked = isStacked;
          window.myChart.options.stacked = isStacked;
        }
        // Restore visibility
        visibility.forEach((v,i)=> window.myChart.setDatasetVisibility(i, v !== false));
        window.myChart.update();
        if (window.syncLegend) window.syncLegend();
        document.querySelectorAll('.legend-item').forEach(el => {
          const i = Number(el.getAttribute('data-ds'));
          if (Number.isFinite(i)) el.setAttribute('aria-pressed', String(window.myChart.isDatasetVisible(i)));
        });
      };

      // Sync legend and ARIA immediately after switching type
      if (window.syncLegend) window.syncLegend();
      document.querySelectorAll('.legend-item').forEach(el => {
        const i = Number(el.getAttribute('data-ds'));
        if (Number.isFinite(i)) el.setAttribute('aria-pressed', String(window.myChart.isDatasetVisible(i)));
      });
    }
  }

  updateButtonText() {
    const toggleButton = document.getElementById('chart-type-toggle');
    if (toggleButton) {
      if (this.currentType === 'line') {
        toggleButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V19H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 15L10 10L13 13L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Gráfico de Barras
        `;
      } else {
        toggleButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V19H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 9H11V15H9V9Z" fill="currentColor"/>
            <path d="M13 5H15V15H13V5Z" fill="currentColor"/>
            <path d="M17 12H19V15H17V12Z" fill="currentColor"/>
          </svg>
          Gráfico de Linhas
        `;
      }
    }
  }

  buildDatasets() {
    // Determine current (possibly filtered) data
    let currentData = window.raw;
    if (window.dateRangeFilter && window.dateRangeFilter.getFilteredData) {
      const filtered = window.dateRangeFilter.getFilteredData();
      currentData = filtered.data;
    }

    const ruim = currentData.ruim.slice();
    const regular = currentData.regular.slice();
    const bom = currentData.bom.slice();

    const datasets = [];

    if (this.currentType === 'line') {
      // Recreate gradient backgrounds like the core chart
      const canvas = document.getElementById('chart');
      const c = canvas.getContext('2d');
      const h = 420;
      const makeGrad = (colorTop, colorBottom) => {
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, colorTop);
        g.addColorStop(1, colorBottom);
        return g;
      };

      datasets.push({
        label: 'Ruim / Péssimo',
        data: ruim,
        borderColor: 'rgba(239,71,111,0.95)',
        backgroundColor: makeGrad('rgba(239,71,111,0.18)','rgba(239,71,111,0.03)'),
        pointBackgroundColor: 'rgba(239,71,111,1)',
        stack: 'stack1',
        type: 'line',
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3
      });

      datasets.push({
        label: 'Regular',
        data: regular,
        borderColor: 'rgba(255,209,102,0.95)',
        backgroundColor: makeGrad('rgba(255,209,102,0.18)','rgba(255,209,102,0.03)'),
        pointBackgroundColor: 'rgba(255,209,102,1)',
        stack: 'stack1',
        type: 'line',
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3
      });

      datasets.push({
        label: 'Ótimo / Bom',
        data: bom,
        borderColor: 'rgba(6,214,160,0.95)',
        backgroundColor: makeGrad('rgba(6,214,160,0.18)','rgba(6,214,160,0.03)'),
        pointBackgroundColor: 'rgba(6,214,160,1)',
        stack: 'stack1',
        type: 'line',
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3
      });
    } else {
      // Bar chart configuration - solid colors
      datasets.push({
        label: 'Ruim / Péssimo',
        data: ruim,
        backgroundColor: 'rgba(239,71,111,1)',
        borderColor: 'rgba(239,71,111,1)',
        borderWidth: 0,
        stack: 'stack1',
        type: 'bar',
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      });

      datasets.push({
        label: 'Regular',
        data: regular,
        backgroundColor: 'rgba(255,209,102,1)',
        borderColor: 'rgba(255,209,102,1)',
        borderWidth: 0,
        stack: 'stack1',
        type: 'bar',
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      });

      datasets.push({
        label: 'Ótimo / Bom',
        data: bom,
        backgroundColor: 'rgba(6,214,160,1)',
        borderColor: 'rgba(6,214,160,1)',
        borderWidth: 0,
        stack: 'stack1',
        type: 'bar',
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      });
    }

    return datasets;
  }

  createChartConfig() {
    // Get current labels (could be filtered)
    let currentLabels = window.labels;
    if (window.dateRangeFilter && window.dateRangeFilter.getFilteredData) {
      const filtered = window.dateRangeFilter.getFilteredData();
      currentLabels = filtered.labels;
    }
    
    // Use stacked layout for bar charts, line charts remain unstacked
    const isStacked = this.currentType === 'bar';
    const bounds = window.computeYBounds ? window.computeYBounds(false, isStacked) : {yMin: 0, yMax: 100};
    
    return {
      type: this.currentType,
      data: {
        labels: currentLabels,
        datasets: this.buildDatasets()
      },
      options: {
        maintainAspectRatio: false,
        animation: {
          duration: this.currentType === 'bar' ? 800 : 400,
          easing: this.currentType === 'bar' ? 'easeOutQuart' : 'easeInOutQuart',
          onComplete: () => {
            // This ensures the chart is fully rendered before any potential export
          }
        },
        interaction: {mode:'index', intersect:false},
        stacked: isStacked,
        plugins: {
          legend: {display:false}, // We use a custom legend
          tooltip: {
            callbacks: {
              label: function(ctx){
                const value = ctx.raw;
                return ctx.dataset.label + ': ' + (value===null? '—' : value + '%');
              }
            }
          }
        },
        scales: {
          x: {
            grid: {display:false},
            ticks: {color:'#cbd5e1'},
            stacked: isStacked
          },
          y: {
            min: bounds.yMin,
            max: bounds.yMax,
            ticks: {color:'#cbd5e1', callback:function(v){return v + '%'}},
            grid: {color:'rgba(255,255,255,0.03)'},
            stacked: isStacked
          }
        },
        elements: {
          line: {tension:0.35, borderWidth:2},
          point: {radius:3}
        }
      }
    };
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.chartTypeToggle = new ChartTypeToggle();
});

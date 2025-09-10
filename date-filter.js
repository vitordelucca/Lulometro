// Date range filter functionality
class DateRangeFilter {
  constructor(labels, data) {
    this.labels = labels;
    this.data = data;
    this.filteredLabels = [...labels];
    this.filteredData = this.deepCopy(data);
    this.init();
  }

  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  init() {
    this.createFilterControls();
    this.attachEventListeners();
  }

  createFilterControls() {
    // Create date range filter controls (hidden by default)
    const filterContainer = document.createElement('div');
    filterContainer.className = 'date-filter-container';
    filterContainer.innerHTML = `
      <div style="margin: 15px 0;">
        <button id="toggle-filter" class="toolbar-button" style="display: flex; align-items: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 4L23 7M19 4L19 7M15 4L15 7M1 11H4L8 20L10 15L14 15L15 11L1 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Filtrar por Período
        </button>
        <div id="date-filter-panel" style="display: none; margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 10px;">
          <h3 style="margin-top: 0;">Filtrar por Período</h3>
          <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
            <div>
              <label for="start-date" style="display: block; margin-bottom: 5px; font-size: 14px;">Data Inicial:</label>
              <select id="start-date" style="padding: 8px; background: var(--card); border: 1px solid rgba(255,255,255,0.1); color: inherit; border-radius: 6px;">
                ${this.labels.map((label, index) => `<option value="${index}">${label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label for="end-date" style="display: block; margin-bottom: 5px; font-size: 14px;">Data Final:</label>
              <select id="end-date" style="padding: 8px; background: var(--card); border: 1px solid rgba(255,255,255,0.1); color: inherit; border-radius: 6px;">
                ${this.labels.map((label, index) => `<option value="${index}" ${index === this.labels.length - 1 ? 'selected' : ''}>${label}</option>`).join('')}
              </select>
            </div>
            <button id="apply-filter" class="toolbar-button">Aplicar Filtro</button>
            <button id="reset-filter" class="toolbar-button">Resetar</button>
          </div>
        </div>
      </div>
    `;
    
    // Insert before the chart container
    const contentElement = document.querySelector('.content');
    contentElement.parentNode.insertBefore(filterContainer, contentElement);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById('toggle-filter');
    const applyBtn = document.getElementById('apply-filter');
    const resetBtn = document.getElementById('reset-filter');
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleFilterPanel());
    }
    
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this.applyFilter());
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilter());
    }
  }

  applyFilter() {
    const startSelect = document.getElementById('start-date');
    const endSelect = document.getElementById('end-date');
    
    const startIndex = parseInt(startSelect.value);
    const endIndex = parseInt(endSelect.value);
    
    if (startIndex >= endIndex) {
      alert('A data inicial deve ser anterior à data final');
      return;
    }
    
    // Filter data
    this.filteredLabels = this.labels.slice(startIndex, endIndex + 1);
    this.filteredData = {
      ruim: this.data.ruim.slice(startIndex, endIndex + 1),
      regular: this.data.regular.slice(startIndex, endIndex + 1),
      bom: this.data.bom.slice(startIndex, endIndex + 1)
    };
    
    // Update chart with filtered data
    this.updateChart();
  }

  resetFilter() {
    this.filteredLabels = [...this.labels];
    this.filteredData = this.deepCopy(this.data);
    
    // Reset select elements
    document.getElementById('start-date').selectedIndex = 0;
    const endSelect = document.getElementById('end-date');
    endSelect.selectedIndex = endSelect.options.length - 1;
    
    // Update chart with original data
    this.updateChart();
  }

  toggleFilterPanel() {
    const panel = document.getElementById('date-filter-panel');
    const toggleBtn = document.getElementById('toggle-filter');
    
    if (panel && toggleBtn) {
      const isHidden = panel.style.display === 'none';
      panel.style.display = isHidden ? 'block' : 'none';
      
      // Update button text/icon
      const icon = toggleBtn.querySelector('svg');
      if (icon) {
        if (isHidden) {
          // Change to "hide" icon
          icon.innerHTML = '<path d="M23 4L23 7M19 4L19 7M15 4L15 7M1 11H4L8 20L10 15L14 15L15 11L1 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 4L19 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
        } else {
          // Change to "show" icon
          icon.innerHTML = '<path d="M23 4L23 7M19 4L19 7M15 4L15 7M1 11H4L8 20L10 15L14 15L15 11L1 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
        }
      }
    }
  }

  updateChart() {
    // Update the chart with filtered data
    if (typeof window.updateChartWithData === 'function') {
      window.updateChartWithData(this.filteredLabels, this.filteredData);
    }
  }

  getFilteredData() {
    return {
      labels: this.filteredLabels,
      data: this.filteredData
    };
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we have the required data
  if (typeof labels !== 'undefined' && typeof raw !== 'undefined') {
    // Initialize date range filter
    window.dateRangeFilter = new DateRangeFilter(labels, raw);
  }
});

// (remove legacy update helper; chart.js exposes updateChartWithData)

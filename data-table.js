// Data table view functionality
class DataTable {
  constructor(labels, data) {
    this.labels = labels;
    this.data = data;
    this.isVisible = false;
    this.init();
  }

  init() {
    this.createToggleButton();
  }

  createToggleButton() {
    // Create toggle button for data table
    const toggleButton = document.createElement('button');
    toggleButton.id = 'data-table-toggle';
    toggleButton.className = 'toolbar-button';
    toggleButton.innerHTML = 'Ver Tabela de Dados';
    toggleButton.setAttribute('aria-expanded', 'false');
    
    // Add to toolbar
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      // Insert before the first button
      toolbar.insertBefore(toggleButton, toolbar.firstChild);
    }
    
    toggleButton.addEventListener('click', () => this.toggleTable());
  }

  createTable() {
    // Create table container
    const tableContainer = document.createElement('div');
    tableContainer.id = 'data-table-container';
    tableContainer.className = 'card';
    tableContainer.style.marginTop = '20px';
    tableContainer.style.display = 'none';
    
    // Create table
    const table = document.createElement('table');
    table.className = 'data-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Data', 'Ruim/Péssimo (%)', 'Regular (%)', 'Ótimo/Bom (%)'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      th.style.textAlign = 'left';
      th.style.padding = '12px';
      th.style.borderBottom = '2px solid rgba(255,255,255,0.1)';
      th.style.fontWeight = '600';
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    for (let i = 0; i < this.labels.length; i++) {
      const row = document.createElement('tr');
      
      // Date cell
      const dateCell = document.createElement('td');
      dateCell.textContent = this.labels[i];
      dateCell.style.padding = '12px';
      dateCell.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      row.appendChild(dateCell);
      
      // Ruim cell
      const ruimCell = document.createElement('td');
      ruimCell.textContent = this.data.ruim[i] !== null ? `${this.data.ruim[i]}%` : '—';
      ruimCell.style.padding = '12px';
      ruimCell.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      row.appendChild(ruimCell);
      
      // Regular cell
      const regularCell = document.createElement('td');
      regularCell.textContent = this.data.regular[i] !== null ? `${this.data.regular[i]}%` : '—';
      regularCell.style.padding = '12px';
      regularCell.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      row.appendChild(regularCell);
      
      // Bom cell
      const bomCell = document.createElement('td');
      bomCell.textContent = this.data.bom[i] !== null ? `${this.data.bom[i]}%` : '—';
      bomCell.style.padding = '12px';
      bomCell.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      row.appendChild(bomCell);
      
      tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    
    // Append table
    tableContainer.appendChild(table);
    
    // Insert after the main content
    const content = document.querySelector('.content');
    if (content) {
      content.parentNode.insertBefore(tableContainer, content.nextSibling);
    }
  }

  toggleTable() {
    const toggleButton = document.getElementById('data-table-toggle');
    const tableContainer = document.getElementById('data-table-container');
    
    if (!tableContainer) {
      // Create table if it doesn't exist
      this.createTable();
      this.isVisible = true;
      toggleButton.textContent = 'Ocultar Tabela';
      toggleButton.setAttribute('aria-expanded', 'true');
      document.getElementById('data-table-container').style.display = 'block';
    } else {
      // Toggle visibility
      this.isVisible = !this.isVisible;
      tableContainer.style.display = this.isVisible ? 'block' : 'none';
      toggleButton.textContent = this.isVisible ? 'Ocultar Tabela' : 'Ver Tabela de Dados';
      toggleButton.setAttribute('aria-expanded', this.isVisible.toString());
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we have the required data
  if (typeof labels !== 'undefined' && typeof raw !== 'undefined') {
    window.dataTable = new DataTable(labels, raw);
  }
});

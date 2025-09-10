// Advanced export functionality
class AdvancedExport {
  constructor() {
    this.init();
  }

  init() {
    this.createExportOptions();
  }

  createExportOptions() {
    // Create export dropdown menu (styles moved to styles.css)
    const exportContainer = document.createElement('div');
    exportContainer.className = 'export-container';
    exportContainer.innerHTML = `
      <div class="export-dropdown">
        <button id="export-menu-button" class="toolbar-button" aria-label="Exportar" aria-haspopup="true" aria-expanded="false">Exportar ▼</button>
        <div id="export-menu" class="export-menu">
          <button class="export-option" data-format="png">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 8px;">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Imagem PNG
          </button>
          <button class="export-option" data-format="csv">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 8px;">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Dados CSV
          </button>
        </div>
      </div>
    `;
    
    // Find the toolbar and insert before the existing export buttons
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      // Hide the old export buttons
      const oldButtons = document.querySelectorAll('#download, #downloadCsv');
      oldButtons.forEach(btn => btn.style.display = 'none');
      
      // Insert the new export dropdown
      toolbar.insertBefore(exportContainer, toolbar.firstChild);
    }
    
    this.attachEventListeners();
  }

  attachEventListeners() {
    const menuButton = document.getElementById('export-menu-button');
    const menu = document.getElementById('export-menu');
    const exportOptions = document.querySelectorAll('.export-option');
    
    if (menuButton) {
      menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isExpanded);
        menu.style.display = isExpanded ? 'none' : 'block';
      });
    }
    
    exportOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const format = option.getAttribute('data-format');
        this.handleExport(format);
        menu.style.display = 'none';
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (menu && menuButton && 
          !menu.contains(e.target) && 
          !menuButton.contains(e.target)) {
        menu.style.display = 'none';
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu && menuButton) {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          menu.style.display = 'none';
          menuButton.setAttribute('aria-expanded', 'false');
          menuButton.focus();
        }
      }
    });
  }

  handleExport(format) {
    switch(format) {
      case 'png':
        // Use existing PNG export function
        if (typeof exportPNG === 'function') {
          exportPNG();
        }
        break;
      case 'csv':
        // Use existing CSV export function
        if (typeof exportCSV === 'function') {
          exportCSV();
        }
        break;
      default:
        console.warn('Unsupported export format:', format);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.advancedExport = new AdvancedExport();
});

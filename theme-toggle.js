// Theme toggle functionality
class ThemeToggle {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.createThemeToggle();
    this.applyTheme(this.currentTheme);
    this.attachEventListeners();
  }

  createThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Alternar tema');
    
    // Set initial icon based on current theme
    const svgContent = this.currentTheme === 'dark' ? 
      '<path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' :
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    
    themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
    
    // Add to the toolbar to align with other buttons
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      toolbar.appendChild(themeToggle);
    }
  }

  applyTheme(theme) {
    // Always remove any existing light theme styles first
    const existingStyles = document.getElementById('light-theme-styles');
    if (existingStyles) {
      existingStyles.remove();
    }
    
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      this.updateThemeIcon('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      this.updateThemeIcon('light');
      
      // Apply light theme styles
      const lightStyles = document.createElement('style');
      lightStyles.id = 'light-theme-styles';
      lightStyles.textContent = `
        :root {
          --bg: #f8fafc;
          --card: #ffffff;
          --muted: #64748b;
          --text: #1e293b;
          --glass: rgba(0,0,0,0.03);
        }
        
        html, body {
          background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 60%);
          color: var(--text);
        }
        
        .wrap {
          background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01));
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        
        .card {
          background: linear-gradient(180deg, rgba(0,0,0,0.01), rgba(0,0,0,0.00));
        }
        
        .social-icon {
          background: var(--glass);
          border: 1px solid rgba(0,0,0,0.06);
          color: var(--text);
        }
        
        .social-icon:hover {
          background: rgba(0,0,0,0.06);
        }
        
        canvas {
          filter: brightness(0.95);
        }
      `;
      
      document.head.appendChild(lightStyles);
    }
    
    // Update current theme and save to localStorage
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Update chart theme if chart is available
    if (typeof updateChartTheme === 'function') {
      setTimeout(() => updateChartTheme(), 50);
    }
  }

  updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      // Preserve existing attributes and only update the inner HTML
      const svgContent = theme === 'dark' ? 
        '<path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' :
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      
      themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  attachEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
      
      // Keyboard accessibility
      themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.themeToggle = new ThemeToggle();
});

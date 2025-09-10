// Simple test suite for the Lulômetro application

// Mock DOM elements for testing
const mockElements = {
  chart: { getContext: () => ({ createLinearGradient: () => ({ addColorStop: () => {} }) }) },
  reset: { addEventListener: () => {} },
  downloadCsv: { addEventListener: () => {} },
  download: { addEventListener: () => {} }
};

// Mock Chart.js
global.Chart = class {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.data = config.data;
    this.options = config.options;
  }
  
  update() {}
  isDatasetVisible() { return true; }
  setDatasetVisibility() {}
};

// Mock document methods
global.document = {
  addEventListener: (event, callback) => {
    if (event === 'DOMContentLoaded') {
      callback();
    }
  },
  querySelector: (selector) => {
    if (selector === '#chart') return mockElements.chart;
    if (selector === '#reset') return mockElements.reset;
    if (selector === '#downloadCsv') return mockElements.downloadCsv;
    if (selector === '#download') return mockElements.download;
    if (selector === 'h1') return { textContent: 'Avaliação do Presidente Lula' };
    if (selector === '.lead') return { textContent: 'Gráfico interativo' };
    return null;
  },
  querySelectorAll: (selector) => {
    if (selector === '.legend-item') return [
      { 
        addEventListener: () => {}, 
        getAttribute: () => '0',
        classList: { toggle: () => {} },
        setAttribute: () => {}
      }
    ];
    return [];
  },
  createElement: () => ({
    set href(value) {},
    set download(value) {},
    click: () => {},
    remove: () => {}
  }),
  body: {
    appendChild: () => {}
  }
};

// Mock window methods
global.window = {
  addEventListener: () => {},
  location: { href: '/' }
};

// Mock other globals
global.URL = {
  createObjectURL: () => 'blob:url',
  revokeObjectURL: () => {}
};
global.Blob = class {};
global.navigator = { serviceWorker: { register: () => Promise.resolve() } };

console.log('Test environment initialized');
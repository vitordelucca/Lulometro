// Global error handling
window.addEventListener('error', function(event) {
  console.error('Error occurred:', event.error);
  // In a production environment, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the default browser behavior
  event.preventDefault();
});

// Function to show user-friendly error messages
function showError(message) {
  // Create error element
  const errorElement = document.createElement('div');
  errorElement.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef476f;
      color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 300px;
    ">
      <strong>Erro:</strong> ${message}
      <button onclick="this.parentElement.remove()" style="
        float: right;
        background: none;
        border: none;
        color: white;
        font-weight: bold;
        cursor: pointer;
        margin-left: 10px;
      ">&times;</button>
    </div>
  `;
  
  // Add to document
  document.body.appendChild(errorElement);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorElement.parentElement) {
      errorElement.parentElement.removeChild(errorElement);
    }
  }, 5000);
}

// Enhanced chart initialization with error handling
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      throw new Error('Chart.js library failed to load');
    }
    
    // Initialize chart (this will be handled by chart.js)
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    showError('Falha ao carregar o gráfico. Por favor, recarregue a página.');
  }
});
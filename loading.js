// Add loading indicator functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loading';
  loadingIndicator.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 36, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    ">
      <div style="
        text-align: center;
        color: #e6eef6;
      ">
        <div style="
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255,255,255,0.1);
          border-top: 5px solid #06d6a0;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        "></div>
        <p>Carregando gráfico...</p>
      </div>
    </div>
  `;
  
  // Add to document
  document.body.appendChild(loadingIndicator);
  
  // Hide loading indicator when chart is ready
  window.addEventListener('load', function() {
    // Small delay to ensure everything is rendered
    setTimeout(() => {
      if (loadingIndicator.parentNode) {
        loadingIndicator.parentNode.removeChild(loadingIndicator);
      }
    }, 500);
  });
});

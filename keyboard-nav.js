// Keyboard navigation helper
document.addEventListener('DOMContentLoaded', function() {
  // Focus management for better keyboard navigation
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    // ESC key to close any open dialogs or reset focus
    if (event.key === 'Escape') {
      // Remove focus from any element
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
    }
    
    // Ctrl+R or Cmd+R to reset chart
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault();
      const resetBtn = document.getElementById('reset');
      if (resetBtn) {
        resetBtn.click();
      }
    }
  });
  
  // Improved focus visibility
  document.addEventListener('focusin', function(event) {
    // Add a focus-visible class for better styling control
    event.target.classList.add('focus-visible');
  });
  
  document.addEventListener('focusout', function(event) {
    // Remove the focus-visible class when focus is lost
    event.target.classList.remove('focus-visible');
  });
});
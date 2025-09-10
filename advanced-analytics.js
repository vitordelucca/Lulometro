// Advanced analytics functionality
class AdvancedAnalytics {
  constructor(labels, rawData) {
    this.labels = labels;
    this.rawData = rawData;
    this.init();
  }

  init() {
    this.createAnalyticsPanel();
    this.calculateInitialStats();
  }

  // Calculate moving averages
  calculateMovingAverage(data, windowSize = 3) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        result.push(null); // Not enough data for moving average
      } else {
        const window = data.slice(i - windowSize + 1, i + 1);
        const sum = window.reduce((acc, val) => acc + (val || 0), 0);
        const count = window.filter(val => val !== null).length;
        result.push(count > 0 ? parseFloat((sum / count).toFixed(2)) : null);
      }
    }
    return result;
  }

  // Calculate percentage changes
  calculatePercentageChange(data) {
    const result = [null]; // No change for first data point
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const current = data[i];
      if (prev === null || current === null) {
        result.push(null);
      } else {
        const change = ((current - prev) / prev) * 100;
        result.push(parseFloat(change.toFixed(2)));
      }
    }
    return result;
  }

  // Calculate statistical summaries
  calculateStats(data) {
    const validData = data.filter(val => val !== null);
    if (validData.length === 0) return null;
    
    const sorted = [...validData].sort((a, b) => a - b);
    const sum = validData.reduce((a, b) => a + b, 0);
    const mean = sum / validData.length;
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    
    return {
      mean: parseFloat(mean.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      min: Math.min(...validData),
      max: Math.max(...validData),
      count: validData.length
    };
  }

  // Simple linear regression for trend prediction
  calculateTrend(data) {
    const validData = data.map((val, index) => val !== null ? {x: index, y: val} : null)
                          .filter(point => point !== null);
    
    if (validData.length < 2) return {slope: 0, direction: 'neutral'};
    
    const n = validData.length;
    const sumX = validData.reduce((sum, point) => sum + point.x, 0);
    const sumY = validData.reduce((sum, point) => sum + point.y, 0);
    const sumXY = validData.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = validData.reduce((sum, point) => sum + point.x * point.x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const direction = slope > 0.1 ? 'up' : slope < -0.1 ? 'down' : 'neutral';
    
    return {
      slope: parseFloat(slope.toFixed(4)),
      direction
    };
  }

  // Predict next values using linear trend
  predictNextValues(data, count = 3) {
    const validData = data.map((val, index) => val !== null ? {x: index, y: val} : null)
                          .filter(point => point !== null);
    
    if (validData.length < 2) return Array(count).fill(null);
    
    const n = validData.length;
    const sumX = validData.reduce((sum, point) => sum + point.x, 0);
    const sumY = validData.reduce((sum, point) => sum + point.y, 0);
    const sumXY = validData.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = validData.reduce((sum, point) => sum + point.x * point.x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const predictions = [];
    for (let i = 1; i <= count; i++) {
      const x = validData[validData.length - 1].x + i;
      const prediction = slope * x + intercept;
      predictions.push(parseFloat(prediction.toFixed(2)));
    }
    
    return predictions;
  }

  // Calculate all analytics for a dataset
  calculateDatasetAnalytics(dataset) {
    return {
      movingAverage: this.calculateMovingAverage(dataset),
      percentageChange: this.calculatePercentageChange(dataset),
      stats: this.calculateStats(dataset),
      trend: this.calculateTrend(dataset),
      predictions: this.predictNextValues(dataset)
    };
  }

  // Calculate analytics for all datasets
  calculateAllAnalytics() {
    return {
      ruim: this.calculateDatasetAnalytics(this.rawData.ruim),
      regular: this.calculateDatasetAnalytics(this.rawData.regular),
      bom: this.calculateDatasetAnalytics(this.rawData.bom)
    };
  }

  calculateInitialStats() {
    this.analytics = this.calculateAllAnalytics();
    this.updateAnalyticsDisplay();
  }

  createAnalyticsPanel() {
    // Create analytics panel
    const analyticsContainer = document.createElement('div');
    analyticsContainer.id = 'analytics-panel';
    analyticsContainer.className = 'card';
    analyticsContainer.style.marginTop = '20px';
    analyticsContainer.style.display = 'none'; // Hidden by default
    
    analyticsContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h2 style="margin: 0;">Análise Avançada</h2>
        <button id="close-analytics" class="toolbar-button" style="padding: 6px 10px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div id="analytics-content">
        <!-- Analytics content will be populated here -->
      </div>
    `;
    
    // Insert after the main content
    const content = document.querySelector('.content');
    if (content) {
      content.parentNode.insertBefore(analyticsContainer, content.nextSibling);
    }
    
    // Add event listener for close button
    const closeBtn = document.getElementById('close-analytics');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        analyticsContainer.style.display = 'none';
        const toggleBtn = document.getElementById('analytics-toggle');
        if (toggleBtn) {
          toggleBtn.textContent = 'Mostrar Análise';
        }
      });
    }
    
    // Add event listener for toggle button
    const toggleBtn = document.getElementById('analytics-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.togglePanel();
      });
    }
  }

  updateAnalyticsDisplay() {
    const content = document.getElementById('analytics-content');
    if (!content) return;
    
    content.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        ${this.renderDatasetAnalytics('Ruim / Péssimo', 'ruim', this.analytics.ruim)}
        ${this.renderDatasetAnalytics('Regular', 'regular', this.analytics.regular)}
        ${this.renderDatasetAnalytics('Ótimo / Bom', 'bom', this.analytics.bom)}
      </div>
      
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
        <h3>Tendências Futuras (Previsão)</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 10px;">
          ${this.renderPredictions('Ruim / Péssimo', this.analytics.ruim.predictions)}
          ${this.renderPredictions('Regular', this.analytics.regular.predictions)}
          ${this.renderPredictions('Ótimo / Bom', this.analytics.bom.predictions)}
        </div>
      </div>
    `;
  }

  renderDatasetAnalytics(title, key, data) {
    const trendIcon = data.trend.direction === 'up' ? 
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="color: #06d6a0;"><path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
      data.trend.direction === 'down' ? 
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="color: #ef476f;"><path d="M12 5V19M19 12L12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="color: #ffd166;"><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    
    return `
      <div style="background: rgba(255,255,255,0.02); border-radius: 8px; padding: 15px;">
        <h3 style="margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px;">
          ${title}
          <span style="margin-left: auto;">${trendIcon}</span>
        </h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <div style="font-size: 12px; color: var(--muted);">Média</div>
            <div style="font-size: 18px; font-weight: 600;">${data.stats ? data.stats.mean + '%' : '—'}</div>
          </div>
          <div>
            <div style="font-size: 12px; color: var(--muted);">Mediana</div>
            <div style="font-size: 18px; font-weight: 600;">${data.stats ? data.stats.median + '%' : '—'}</div>
          </div>
          <div>
            <div style="font-size: 12px; color: var(--muted);">Mínimo</div>
            <div style="font-size: 18px; font-weight: 600;">${data.stats ? data.stats.min + '%' : '—'}</div>
          </div>
          <div>
            <div style="font-size: 12px; color: var(--muted);">Máximo</div>
            <div style="font-size: 18px; font-weight: 600;">${data.stats ? data.stats.max + '%' : '—'}</div>
          </div>
        </div>
        
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05);">
          <div style="font-size: 12px; color: var(--muted);">Tendência</div>
          <div style="display: flex; align-items: center; gap: 5px; margin-top: 3px;">
            <span>${data.trend.direction === 'up' ? 'Crescendo' : data.trend.direction === 'down' ? 'Diminuindo' : 'Estável'}</span>
            <span style="font-size: 12px; color: var(--muted);">(${data.trend.slope > 0 ? '+' : ''}${data.trend.slope})</span>
          </div>
        </div>
      </div>
    `;
  }

  renderPredictions(title, predictions) {
    const predictionItems = predictions.map((pred, index) => 
      `<div style="font-size: 14px;">Dia ${index + 1}: <strong>${pred !== null ? pred + '%' : '—'}</strong></div>`
    ).join('');
    
    return `
      <div style="background: rgba(255,255,255,0.02); border-radius: 8px; padding: 12px;">
        <h4 style="margin: 0 0 8px 0; font-size: 14px;">${title}</h4>
        ${predictionItems}
      </div>
    `;
  }

  togglePanel() {
    const panel = document.getElementById('analytics-panel');
    const toggleBtn = document.getElementById('analytics-toggle');
    
    if (panel && toggleBtn) {
      const isHidden = panel.style.display === 'none';
      panel.style.display = isHidden ? 'block' : 'none';
      toggleBtn.textContent = isHidden ? 'Ocultar Análise' : 'Mostrar Análise';
      
      // Recalculate analytics when showing
      if (isHidden) {
        this.calculateInitialStats();
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we have the required data
  if (typeof labels !== 'undefined' && typeof raw !== 'undefined') {
    window.advancedAnalytics = new AdvancedAnalytics(labels, raw);
  }
});
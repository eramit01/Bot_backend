/**
 * Spa Bot Widget Loader
 */
(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__SPA_BOT_LOADED) {
    return;
  }
  window.__SPA_BOT_LOADED = true;

  // Get the current script element
  const currentScript = document.currentScript || 
    document.querySelector('script[src*="bot.js"]');

  if (!currentScript) {
    console.error('[SpaBot] Could not find script element');
    return;
  }

  // Extract spaId from query parameter
  const scriptSrc = currentScript.src;
  const urlParams = new URLSearchParams(scriptSrc.split('?')[1] || '');
  const spaId = urlParams.get('spa');

  if (!spaId) {
    console.error('[SpaBot] Missing spaId. Use: bot.js?spa=YOUR_SPA_ID');
    return;
  }

  // Determine base URL - use the script's origin
  const scriptUrl = new URL(scriptSrc);
  const baseUrl = `${scriptUrl.origin}`;

  console.log('[SpaBot] Initializing with spaId:', spaId, 'baseUrl:', baseUrl);

  // Check if widget container already exists
  if (document.getElementById('spa-bot-root')) {
    return;
  }

  function initWidget() {
    // Create container
    const container = document.createElement('div');
    container.id = 'spa-bot-root';
    container.setAttribute('data-spa-id', spaId);
    
    // Critical styles for the container
    container.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      width: 400px !important;
      height: 600px !important;
      max-width: calc(100vw - 40px) !important;
      max-height: calc(100vh - 40px) !important;
      z-index: 2147483647 !important;
      border: none !important;
      border-radius: 12px !important;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
      overflow: hidden !important;
      background: white !important;
    `;

    // Create iframe - point to your widget.html
    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}/widget.html?spa=${encodeURIComponent(spaId)}`;
    iframe.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      background: transparent !important;
    `;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'clipboard-write');

    container.appendChild(iframe);
    document.body.appendChild(container);

    console.log('[SpaBot] Widget loaded successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  // Expose global API
  window.SpaBot = {
    spaId: spaId,
    baseUrl: baseUrl,
    version: '1.0.0'
  };
})();
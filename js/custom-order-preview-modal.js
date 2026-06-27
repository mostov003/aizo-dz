/**
 * Custom Order Preview Modal - Modular & Responsive
 * ════════════════════════════════════════════════════════════
 * Purpose: Clean, isolated modal for viewing individual design layers
 * Features:
 *   - Tab-based layer selection (isolated preview)
 *   - Responsive garment rendering with no clipping
 *   - Independent layer download buttons
 *   - Visual placement guide overlay
 * ════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // 1. LAYER SELECTOR MODAL MARKUP & INITIALIZATION
  // ────────────────────────────────────────────────────────────

  window.CustomOrderPreviewModal = {
    currentOrderId: null,
    currentSelectedLayerIndex: null,
    showPlacementGuide: false,

    /**
     * Initialize the modal with layer-aware controls
     * @param {string} orderId - Order ID
     * @param {Array} layers - Array of design layers
     * @param {Object} customOrder - Complete customOrder object
     * @param {Object} order - Complete order object
     */
    init: function(orderId, layers, customOrder, order) {
      this.currentOrderId = orderId;
      this.currentSelectedLayerIndex = 0; // Default to first layer
      this.showPlacementGuide = false;

      // Create modal HTML if it doesn't exist
      this.createModalMarkup();

      // Populate with layer data
      this.renderLayerTabs(layers);
      this.renderLayerPreview(layers[0], 0, customOrder, order);

      // Show modal
      const modal = document.getElementById('co-layer-selector-modal');
      if (modal) {
        modal.style.display = 'flex';
        // Smooth scroll to modal
        setTimeout(() => {
          modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    },

    createModalMarkup: function() {
      let existingModal = document.getElementById('co-layer-selector-modal');
      if (existingModal) return; // Modal already exists

      const modalHtml = `
        <div class="co-layer-modal-overlay" id="co-layer-modal-overlay" onclick="window.CustomOrderPreviewModal.closeModal()">
          <div class="co-layer-modal-container" onclick="event.stopPropagation()">
            <!-- Header -->
            <div class="co-layer-modal-header">
              <h2 class="co-layer-modal-title">معاينة التصميم المتقدمة / Advanced Design Preview</h2>
              <button type="button" class="co-layer-modal-close" onclick="window.CustomOrderPreviewModal.closeModal()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Layer Tabs/Selector -->
            <div class="co-layer-tabs-container">
              <div class="co-layer-tabs" id="co-layer-tabs"></div>
              <div class="co-layer-info-badge" id="co-layer-info">
                <span class="badge-text"></span>
              </div>
            </div>

            <!-- Main Preview Content -->
            <div class="co-layer-modal-content">
              <!-- Left: Garment with Design Overlay -->
              <div class="co-layer-preview-left">
                <div class="co-garment-wrapper">
                  <!-- padding-top trick: maintains exact 480x520 ratio for correct % positioning -->
                  <div class="co-garment-canvas-ratio" id="co-garment-container" style="position:relative;width:100%;padding-top:calc(520/480*100%);overflow:visible;">
                    <div style="position:absolute;inset:0;">
                      <img id="co-garment-base" src="" alt="Garment" class="co-garment-base" style="width:100%;height:100%;object-fit:contain;display:block;" />
                      <div class="co-design-placement-zone" id="co-design-zone" style="position:absolute;">
                        <img id="co-design-overlay" src="" alt="Design" class="co-design-overlay" />
                      </div>
                    </div>
                  </div>
                  <div class="co-placement-guide-overlay" id="co-placement-guide" style="display: none;">
                    <div class="guide-crosshair"></div>
                    <div class="guide-grid"></div>
                    <span class="guide-label">Placement Guide</span>
                  </div>
                </div>

                <!-- Controls Under Preview -->
                <div class="co-layer-controls">
                  <button type="button" class="btn-layer-control btn-placement-guide" id="btn-placement-guide" onclick="window.CustomOrderPreviewModal.togglePlacementGuide()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="8"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Visual Guide
                  </button>
                  <button type="button" class="btn-layer-control btn-download-layer" id="btn-download-layer" onclick="window.CustomOrderPreviewModal.downloadCurrentLayer()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download Design
                  </button>
                </div>
              </div>

              <!-- Right: Layer Details & Specifications -->
              <div class="co-layer-details-right">
                <div class="co-layer-specs">
                  <h3 class="specs-heading">مواصفات الطبقة / Layer Specifications</h3>
                  
                  <div class="spec-item">
                    <label class="spec-label">موقع الطبقة / Placement:</label>
                    <span class="spec-value" id="spec-placement">Center</span>
                  </div>

                  <div class="spec-item">
                    <label class="spec-label">الإحداثيات / Coordinates:</label>
                    <span class="spec-value" id="spec-coords">X: 0, Y: 0</span>
                  </div>

                  <div class="spec-item">
                    <label class="spec-label">الحجم / Size:</label>
                    <span class="spec-value" id="spec-size">100 × 100 px</span>
                  </div>

                  <div class="spec-item">
                    <label class="spec-label">الزاوية / Angle:</label>
                    <span class="spec-value" id="spec-angle">0°</span>
                  </div>

                  <div class="spec-item">
                    <label class="spec-label">المقياس / Scale:</label>
                    <span class="spec-value" id="spec-scale">100%</span>
                  </div>

                  <hr class="spec-divider" />

                  <div class="spec-item">
                    <label class="spec-label">معلومات الصورة / Image Info:</label>
                    <span class="spec-value" id="spec-image-info">Original: 120 × 120 px</span>
                  </div>
                </div>

                <div class="co-layer-actions">
                  <button type="button" class="btn-action btn-action-primary" onclick="window.CustomOrderPreviewModal.closeModal()">
                    تم / Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Insert modal into page
      const container = document.body;
      const modalDiv = document.createElement('div');
      modalDiv.id = 'co-layer-selector-modal';
      modalDiv.className = 'co-layer-modal';
      modalDiv.innerHTML = modalHtml;
      container.appendChild(modalDiv);
    },

    /**
     * Render layer selection tabs
     * @param {Array} layers - Design layers
     */
    renderLayerTabs: function(layers) {
      const tabsContainer = document.getElementById('co-layer-tabs');
      if (!tabsContainer) return;

      let tabsHtml = '';
      layers.forEach((layer, idx) => {
        const areaLabel = window.getAreaLabel ? window.getAreaLabel(layer.area) : layer.area;
        const isActive = idx === this.currentSelectedLayerIndex ? 'active' : '';
        tabsHtml += `
          <button type="button" class="co-layer-tab ${isActive}" data-layer-idx="${idx}" onclick="window.CustomOrderPreviewModal.selectLayer(${idx})">
            <span class="tab-badge">${idx + 1}</span>
            <span class="tab-text">${areaLabel}</span>
          </button>
        `;
      });

      tabsContainer.innerHTML = tabsHtml;
    },

    /**
     * Select and render a specific layer
     * @param {number} layerIndex - Index of layer to display
     */
    selectLayer: function(layerIndex) {
      this.currentSelectedLayerIndex = layerIndex;

      // Update active tab
      document.querySelectorAll('.co-layer-tab').forEach((tab, idx) => {
        tab.classList.toggle('active', idx === layerIndex);
      });

      // Get the order and layers from cache
      const order = window.cachedOrders?.find(o => String(o.id) === String(this.currentOrderId));
      if (!order || !order.customOrder) return;

      const layers = order.customOrder.layers || [];
      const layer = layers[layerIndex];
      if (!layer) return;

      // Render the preview for this layer
      this.renderLayerPreview(layer, layerIndex, order.customOrder, order);
    },

    /**
     * Render individual layer preview with full garment rendering
     * @param {Object} layer - The layer object
     * @param {number} layerIndex - Layer index
     * @param {Object} customOrder - Custom order data
     * @param {Object} order - Complete order
     */
    renderLayerPreview: function(layer, layerIndex, customOrder, order) {
      // Detect garment type
      const garmentType = window.detectGarmentTypeFromOrder ? window.detectGarmentTypeFromOrder(order) : 'tshirt';
      const garmentHex = window.CO_COLOR_TO_HEX?.[customOrder.color] || '#1a1a1a';

      // Generate full garment SVG for this specific area
      const svgStr = window.adminGenerateGarmentSVG ? 
        window.adminGenerateGarmentSVG(garmentType, layer.area, garmentHex) : 
        this.generateFallbackGarmentSVG(garmentType, garmentHex);

      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));

      // Update garment base image
      const garmentImg = document.getElementById('co-garment-base');
      if (garmentImg) {
        garmentImg.src = svgDataUrl;
      }

      // Update design overlay positioning
      const designImg = document.getElementById('co-design-overlay');
      const designZone = document.getElementById('co-design-zone');
      if (designImg && designZone) {
        // Reset styles and remove old placeholders on load
        designImg.style.display = 'block';
        designZone.style.border = '';
        designZone.style.background = '';
        const oldPlaceholder = designZone.querySelector('.co-design-placeholder-fallback');
        if (oldPlaceholder) {
          oldPlaceholder.remove();
        }

        const resolvedUrl = window.resolveAssetUrl ? window.resolveAssetUrl(layer.img) : layer.img;

        const applyDesignSizing = () => {
          const naturalW = designImg.naturalWidth || 120;
          const naturalH = designImg.naturalHeight || 120;
          const scaleX = layer.scaleX || 1;
          const scaleY = layer.scaleY || 1;

          let widthPx = Math.max(20, naturalW * scaleX);
          let heightPx = Math.max(20, naturalH * scaleY);

          // Constrain massive images (e.g. from simple Vue upload) to fit the garment
          const maxW = 380;
          const maxH = 420;
          if (widthPx > maxW || heightPx > maxH) {
            const ratio = Math.min(maxW / widthPx, maxH / heightPx);
            widthPx = widthPx * ratio;
            heightPx = heightPx * ratio;
          }

          let centerX = layer.left;
          let centerY = layer.top;
          if (typeof centerX !== 'number' || typeof centerY !== 'number' || (centerX === 0 && centerY === 0)) {
            centerX = 240;
            centerY = 260;
          }

          // Convert center coordinates to top-left
          const leftPx = centerX - (widthPx / 2);
          const topPx = centerY - (heightPx / 2);

          const angle = layer.angle || 0;

          // Apply percentage-based responsive layout (relative to 480x520 system)
          designZone.style.left = (leftPx / 480 * 100) + '%';
          designZone.style.top = (topPx / 520 * 100) + '%';
          designZone.style.width = (widthPx / 480 * 100) + '%';
          designZone.style.height = (heightPx / 520 * 100) + '%';
          designZone.style.transform = `rotate(${angle}deg)`;

          // Dynamically update the specifications panel with exact size and original info
          const sizeEl = document.getElementById('spec-size');
          if (sizeEl) {
            sizeEl.textContent = `${Math.round(widthPx)} × ${Math.round(heightPx)} px`;
          }
          const imgInfoEl = document.getElementById('spec-image-info');
          if (imgInfoEl) {
            imgInfoEl.textContent = `Original: ${naturalW} × ${naturalH} px`;
          }
        };

        // Hook load events
        designImg.onload = applyDesignSizing;
        designImg.onerror = function() {
          console.error('[❌ Advanced Modal Design Image ERROR] Failed to load: ' + designImg.src);
          designImg.style.display = 'none';
          
          let placeholder = designZone.querySelector('.co-design-placeholder-fallback');
          if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.className = 'co-design-placeholder-fallback';
            designZone.appendChild(placeholder);
          }
          placeholder.style.width = '100%';
          placeholder.style.height = '100%';
          placeholder.style.display = 'flex';
          placeholder.style.alignItems = 'center';
          placeholder.style.justifyContent = 'center';
          placeholder.style.color = '#ef4444';
          placeholder.style.fontSize = '0.7rem';
          placeholder.style.fontWeight = 'bold';
          placeholder.style.textAlign = 'center';
          placeholder.style.direction = 'rtl';
          placeholder.textContent = '⚠️ تصميم مفقود';

          designZone.style.border = '2px dashed #ef4444';
          designZone.style.background = 'rgba(239, 68, 68, 0.15)';

          const scaleX = layer.scaleX || 1;
          const scaleY = layer.scaleY || 1;
          const naturalW = 120;
          const naturalH = 120;
          let widthPx = Math.max(20, naturalW * scaleX);
          let heightPx = Math.max(20, naturalH * scaleY);

          // Constrain massive images (e.g. from simple Vue upload) to fit the garment
          const maxW = 380;
          const maxH = 420;
          if (widthPx > maxW || heightPx > maxH) {
            const ratio = Math.min(maxW / widthPx, maxH / heightPx);
            widthPx = widthPx * ratio;
            heightPx = heightPx * ratio;
          }

          let centerX = layer.left;
          let centerY = layer.top;
          if (typeof centerX !== 'number' || typeof centerY !== 'number' || (centerX === 0 && centerY === 0)) {
            centerX = 240;
            centerY = 260;
          }

          const leftPx = centerX - (widthPx / 2);
          const topPx = centerY - (heightPx / 2);
          const angle = layer.angle || 0;

          designZone.style.left = (leftPx / 480 * 100) + '%';
          designZone.style.top = (topPx / 520 * 100) + '%';
          designZone.style.width = (widthPx / 480 * 100) + '%';
          designZone.style.height = (heightPx / 520 * 100) + '%';
          designZone.style.transform = `rotate(${angle}deg)`;

          const sizeEl = document.getElementById('spec-size');
          if (sizeEl) sizeEl.innerHTML = '<span style="color:#ef4444;font-weight:bold;">الصورة مفقودة</span>';
          const imgInfoEl = document.getElementById('spec-image-info');
          if (imgInfoEl) imgInfoEl.innerHTML = '<span style="color:#ef4444;">Image Missing</span>';
        };

        designImg.src = resolvedUrl;

        if (designImg.complete) {
          applyDesignSizing();
        }
      }

      // Update layer info badge
      const infoBadge = document.getElementById('co-layer-info');
      if (infoBadge) {
        const areaLabel = window.getAreaLabel ? window.getAreaLabel(layer.area) : layer.area;
        infoBadge.innerHTML = `<span class="badge-text">📐 ${areaLabel} — صورة ${layerIndex + 1} من ${window.cachedOrders?.find(o => String(o.id) === String(this.currentOrderId))?.customOrder?.layers?.length || 1}</span>`;
      }

      // Update specifications panel
      this.updateSpecsPanel(layer, customOrder);
    },

    /**
     * Update specifications display panel
     * @param {Object} layer - Layer data
     * @param {Object} customOrder - Custom order
     */
    updateSpecsPanel: function(layer, customOrder) {
      // Placement
      const placementEl = document.getElementById('spec-placement');
      if (placementEl) {
        placementEl.textContent = window.getAreaLabel ? window.getAreaLabel(layer.area) : layer.area;
      }

      // Coordinates
      const coordsEl = document.getElementById('spec-coords');
      if (coordsEl) {
        coordsEl.textContent = `X: ${Math.round(layer.left || 0)}, Y: ${Math.round(layer.top || 0)}`;
      }

      // Size
      const sizeEl = document.getElementById('spec-size');
      if (sizeEl) {
        const w = Math.round((layer.originalWidth || 120) * (layer.scaleX || 1));
        const h = Math.round((layer.originalHeight || 120) * (layer.scaleY || 1));
        sizeEl.textContent = `${w} × ${h} px`;
      }

      // Angle
      const angleEl = document.getElementById('spec-angle');
      if (angleEl) {
        angleEl.textContent = `${Math.round(layer.angle || 0)}°`;
      }

      // Scale
      const scaleEl = document.getElementById('spec-scale');
      if (scaleEl) {
        const scalePercent = Math.round((layer.scaleX || 1) * 100);
        scaleEl.textContent = `${scalePercent}%`;
      }

      // Original dimensions
      const imgInfoEl = document.getElementById('spec-image-info');
      if (imgInfoEl) {
        imgInfoEl.textContent = `Original: ${layer.originalWidth || 120} × ${layer.originalHeight || 120} px`;
      }
    },

    /**
     * Toggle visual placement guide overlay
     */
    togglePlacementGuide: function() {
      this.showPlacementGuide = !this.showPlacementGuide;
      const guideOverlay = document.getElementById('co-placement-guide');
      const guideBtn = document.getElementById('btn-placement-guide');

      if (guideOverlay) {
        guideOverlay.style.display = this.showPlacementGuide ? 'flex' : 'none';
      }

      if (guideBtn) {
        guideBtn.classList.toggle('active', this.showPlacementGuide);
      }
    },

    /**
     * Download the current layer's design
     */
    downloadCurrentLayer: function() {
      const order = window.cachedOrders?.find(o => String(o.id) === String(this.currentOrderId));
      if (!order || !order.customOrder) return;

      const layers = order.customOrder.layers || [];
      const layer = layers[this.currentSelectedLayerIndex];
      if (!layer) return;

      const resolvedUrl = window.resolveAssetUrl ? window.resolveAssetUrl(layer.img) : layer.img;
      const areaLabel = window.getAreaLabel ? window.getAreaLabel(layer.area) : layer.area;

      // Create download link
      const link = document.createElement('a');
      link.href = resolvedUrl;
      link.download = `design-${this.currentOrderId}-${areaLabel}-${this.currentSelectedLayerIndex + 1}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    /**
     * Close the modal
     */
    closeModal: function() {
      const modal = document.getElementById('co-layer-selector-modal');
      if (modal) {
        modal.style.display = 'none';
      }
      this.showPlacementGuide = false;
      this.currentOrderId = null;
      this.currentSelectedLayerIndex = null;
    },

    /**
     * Fallback garment SVG generator (if window function not available)
     */
    generateFallbackGarmentSVG: function(type, color) {
      const w = 480, h = 520;
      let paths = '<path d="M 110 110 L 175 60 C 195 80, 285 80, 305 60 L 370 110 L 430 190 L 375 220 L 340 200 L 340 460 C 340 470, 330 480, 320 480 L 160 480 C 150 480, 140 470, 140 460 L 140 200 L 105 220 L 50 190 Z" fill="' + color + '" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>';

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs><pattern id="co-checkers" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="rgba(255,255,255,0.03)"/><rect x="10" width="10" height="10" fill="rgba(0,0,0,0.03)"/><rect y="10" width="10" height="10" fill="rgba(0,0,0,0.03)"/></pattern></defs>
        <rect width="${w}" height="${h}" fill="url(#co-checkers)"/>
        <g>${paths}</g>
      </svg>`;
    }
  };

  // ────────────────────────────────────────────────────────────
  // 2. ENTRY POINT: Open Modal from Dashboard
  // ────────────────────────────────────────────────────────────

  /**
   * Open the modular preview modal for a custom order
   * Usage: window.openLayerPreviewModal(orderId)
   */
  window.openLayerPreviewModal = function(orderId) {
    const order = window.cachedOrders?.find(o => String(o.id) === String(orderId));
    if (!order || !order.customOrder) {
      console.warn('Order not found or no custom order data');
      return;
    }

    const layers = order.customOrder.layers || [];
    if (layers.length === 0) {
      alert('لا توجد تصاميم مرفقة / No designs attached');
      return;
    }

    // Initialize and show modal
    window.CustomOrderPreviewModal.init(orderId, layers, order.customOrder, order);
  };

})();

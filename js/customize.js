/* ════════════════════════════════════════════
   aizo.dz — customize.js
   Dedicated Custom Order Page & Live Preview Canvas Engine
   ════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Clean up localStorage on page load to prevent quota exceeded errors ──
  function cleanupLocalStorage() {
    try {
      // Try to get current size
      const testData = 'test_' + Date.now();
      localStorage.setItem(testData, testData);
      localStorage.removeItem(testData);
      
      // If we get here, storage is not full. But let's clean old entries anyway
      const allKeys = Object.keys(localStorage);
      let storageSize = 0;
      
      for (let key of allKeys) {
        try {
          const value = localStorage.getItem(key);
          if (value) storageSize += value.length;
        } catch (e) {}
      }
      
      // If storage seems large (> 4MB), clear old local orders
      if (storageSize > 4 * 1024 * 1024) {
        console.warn('localStorage is large, clearing old orders to free space');
        try {
          localStorage.removeItem('local_orders');
        } catch (e) {
          console.error('Cannot clear local_orders:', e);
        }
      }
    } catch (e) {
      console.warn('localStorage quota exceeded on page load, attempting cleanup:', e);
      // Try to clear old orders if quota is exceeded
      try {
        localStorage.removeItem('local_orders');
      } catch (err) {
        console.error('Cannot clear local_orders:', err);
      }
    }
  }
  
  // Run cleanup when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupLocalStorage);
  } else {
    cleanupLocalStorage();
  }

  // ── Utility Helpers ──
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ── Page State ──
  let currentProduct = null;
  let urlProduct = null;
  let productType = 'tshirt'; // 'tshirt', 'hoodie', 'polo'

  const GENERIC_CUSTOM_PRODUCTS = {
    tshirt: {
      id: 901,
      name: "T-Shirt Personnalisé / Custom T-Shirt",
      category: "T-Shirt",
      price: "3,900"
    },
    hoodie: {
      id: 902,
      name: "Hoodie Personnalisé / Custom Hoodie",
      category: "Hoodies",
      price: "5,500"
    },
    polo: {
      id: 903,
      name: "Polo Personnalisé / Custom Polo",
      category: "Polo",
      price: "4,500"
    },
    cap: {
      id: 904,
      name: "Casquette Personnalisée / Custom Cap",
      category: "Accessoire",
      price: "2,500"
    },
    bob: {
      id: 905,
      name: "Bob Personnalisé / Custom Bob",
      category: "Accessoire",
      price: "2,900"
    },
    jogging: {
      id: 906,
      name: "Jogging Personnalisé / Custom Jogging",
      category: "Pantalon",
      price: "4,900"
    },
    short: {
      id: 907,
      name: "Short Personnalisé / Custom Short",
      category: "Pantalon",
      price: "3,500"
    }
  };

  let garmentColor = '#1a1a1a'; // Active hex color
  let garmentColorName = 'Noir';
  let garmentSize = 'M';
  let productionMethod = 'Embroidery';
  
  let currentArea = 'Center'; // 'Center', 'ChestLeft', 'Back', 'SleeveRight', 'SleeveLeft'
  let currentStep = 1;
  let fabricCanvas = null;

  // Store layer designs per area
  // format: { areaName: { json: fabricJsonState, rawDesigns: [ { id, rawSrc, file } ] } }
  const areaCanvasData = {
    Center: { json: null, rawDesigns: [] },
    ChestLeft: { json: null, rawDesigns: [] },
    ChestRight: { json: null, rawDesigns: [] },
    Back: { json: null, rawDesigns: [] },
    SleeveRight: { json: null, rawDesigns: [] },
    SleeveLeft: { json: null, rawDesigns: [] }
  };

  // ── Color Swatches Mapping ──
  const COLOR_NAMES = {
    '#1a1a1a': 'Noir',
    '#FFFFFF': 'Blanc',
    '#D4C5A9': 'Beige',
    '#1B2A4A': 'Navy',
    '#4A5568': 'Gris',
    '#5B2C1A': 'Marron'
  };

  const COLOR_NAME_TO_HEX = {
    'أسود': '#1a1a1a',
    'Noir': '#1a1a1a',
    'black': '#1a1a1a',
    'Black': '#1a1a1a',
    'Blanc': '#FFFFFF',
    'white': '#FFFFFF',
    'White': '#FFFFFF',
    'Beige': '#D4C5A9',
    'beige': '#D4C5A9',
    'Navy': '#1B2A4A',
    'Gris': '#4A5568',
    'gray': '#4A5568',
    'Grey': '#4A5568',
    'Marron': '#5B2C1A',
    'Brown': '#5B2C1A'
  };

  // ── Predefined Area Guides (Print Zones) ──
  const PRINT_ZONE_CONFIGS = {
    tshirt: {
      Center: { left: 10, top: 10, width: 460, height: 500 },
      ChestLeft: { left: 10, top: 10, width: 460, height: 500 },
      ChestRight: { left: 10, top: 10, width: 460, height: 500 },
      Back: { left: 10, top: 10, width: 460, height: 500 },
      SleeveRight: { left: 10, top: 10, width: 460, height: 500 },
      SleeveLeft: { left: 10, top: 10, width: 460, height: 500 }
    },
    hoodie: {
      Center: { left: 10, top: 10, width: 460, height: 500 },
      ChestLeft: { left: 10, top: 10, width: 460, height: 500 },
      ChestRight: { left: 10, top: 10, width: 460, height: 500 },
      Back: { left: 10, top: 10, width: 460, height: 500 },
      SleeveRight: { left: 10, top: 10, width: 460, height: 500 },
      SleeveLeft: { left: 10, top: 10, width: 460, height: 500 }
    },
    polo: {
      Center: { left: 10, top: 10, width: 460, height: 500 },
      ChestLeft: { left: 10, top: 10, width: 460, height: 500 },
      ChestRight: { left: 10, top: 10, width: 460, height: 500 },
      Back: { left: 10, top: 10, width: 460, height: 500 },
      SleeveRight: { left: 10, top: 10, width: 460, height: 500 },
      SleeveLeft: { left: 10, top: 10, width: 460, height: 500 }
    },
    cap: {
      Center: { left: 10, top: 10, width: 460, height: 500 },
      Back: { left: 10, top: 10, width: 460, height: 500 }
    },
    bob: {
      Center: { left: 10, top: 10, width: 460, height: 500 },
      Back: { left: 10, top: 10, width: 460, height: 500 }
    },
    jogging: {
      Center: { left: 10, top: 10, width: 460, height: 500 }
    },
    short: {
      Center: { left: 10, top: 10, width: 460, height: 500 }
    }
  };

  // ── DOM Init ──
  async function initializeCustomizePage() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    if (typeof loadProducts === 'function') {
      await loadProducts();
    }

    const products = window.PRODUCTS || [];
    if (productId) {
      urlProduct = products.find(p => p.id === productId);
    }

    if (urlProduct) {
      currentProduct = urlProduct;
      detectProductType();
    } else {
      productType = 'tshirt';
      currentProduct = GENERIC_CUSTOM_PRODUCTS[productType];
    }

    // Render page headers
    initUIElements();

    // Initialize Canvas
    initFabricCanvas();

    // Make submit helper available for debugging and fallback usage
    window.submitCustomOrder = submitCustomOrder;
    window.goToStep = goToStep;

    // Set step UI
    goToStep(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCustomizePage);
  } else {
    initializeCustomizePage();
  }

  // Helper to determine product garment type
  function getGarmentTypeOfProduct(product) {
    if (!product) return 'tshirt';
    const name = (product.name || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    if (name.includes('hoodie') || category.includes('hoodies')) {
      return 'hoodie';
    } else if (name.includes('polo')) {
      return 'polo';
    } else if (name.includes('cap') || category.includes('cap') || name.includes('casquette')) {
      return 'cap';
    } else if (name.includes('bob')) {
      return 'bob';
    } else if (name.includes('jogging')) {
      return 'jogging';
    } else if (name.includes('short')) {
      return 'short';
    } else {
      return 'tshirt';
    }
  }

  // ── Product Detection ──
  function detectProductType() {
    productType = getGarmentTypeOfProduct(currentProduct);
    console.log(`Detected product type: ${productType}`);
  }

  function isAreaVisible(area) {
    const configs = PRINT_ZONE_CONFIGS[productType] || PRINT_ZONE_CONFIGS.tshirt;
    return typeof configs[area] !== 'undefined';
  }

  function updateAreaButtonsVisibility() {
    document.querySelectorAll('.co-area-button').forEach(button => {
      button.classList.toggle('active', button.dataset.area === currentArea);
    });
  }

  function findFirstVisibleArea() {
    const button = Array.from(document.querySelectorAll('.co-area-button')).find(btn => {
      return isAreaVisible(btn.dataset.area);
    });
    return button ? button.dataset.area : 'Center';
  }

  // ── UI Control Bindings ──
  function initUIElements() {
    // Dynamic titles
    const floatingName = document.getElementById('co-floating-name');
    const floatingCat = document.getElementById('co-floating-category');
    if (floatingName) floatingName.textContent = currentProduct.name;
    if (floatingCat) floatingCat.textContent = currentProduct.category || 'Apparel';

    // Page title
    document.title = `Personnaliser ${currentProduct.name} — AIZO.DZ`;

    // Render preview thumbnail for current product
    renderProductPreview();

    // Garment type selector
    const typeBtns = document.querySelectorAll('.co-type-btn');
    typeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === productType);
      btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const newType = btn.dataset.type;
        if (newType === productType) return;
        
        productType = newType;
        
        // Determine product details
        if (urlProduct && getGarmentTypeOfProduct(urlProduct) === productType) {
          currentProduct = urlProduct;
        } else {
          currentProduct = GENERIC_CUSTOM_PRODUCTS[productType];
        }
        
        // Update floating details
        if (floatingName) floatingName.textContent = currentProduct.name;
        if (floatingCat) floatingCat.textContent = currentProduct.category || 'Apparel';
        document.title = `Personnaliser ${currentProduct.name} — AIZO.DZ`;
        
        // Update background & preview
        updateGarmentBackground();
        updateAreaTabsVisibility();
        renderProductPreview();
        fitCanvasToContainer();
      });
    });

    // Step Nav buttons
    const prevBtn = document.getElementById('co-prev');
    const nextBtn = document.getElementById('co-next');
    const submitBtn = document.getElementById('co-submit');
    const formNextBtn = document.getElementById('co-form-next');
    const coForm = document.getElementById('co-form');
    const successClose = document.getElementById('co-success-close');

    if (coForm) {
      coForm.addEventListener('submit', (evt) => evt.preventDefault());
    }

    prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
    nextBtn.addEventListener('click', () => goToStep(currentStep + 1));
    submitBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      submitCustomOrder();
    });
    if (formNextBtn) {
      formNextBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (validateCustomerForm()) {
          goToStep(3);
        }
      });
    }
    if (successClose) {
      successClose.addEventListener('click', () => {
        if (window.coRedirectInterval) {
          clearInterval(window.coRedirectInterval);
        }
        const successOverlay = document.getElementById('co-success-overlay');
        if (successOverlay) {
          successOverlay.style.display = 'none';
        }
        setTimeout(() => {
          window.location.href = window.location.origin + '/';
        }, 300);
      });
    }

    // Print area selector buttons
    const areaButtons = document.querySelectorAll('.co-area-button');

    function updateAreaButtonsVisibility() {
      areaButtons.forEach(button => {
        const area = button.dataset.area;
        button.classList.toggle('active', area === currentArea);
        button.style.display = isAreaVisible(area) ? '' : 'none';
      });

      const selected = Array.from(areaButtons).find(button => button.dataset.area === currentArea);
      if (!selected && areaButtons.length > 0) {
        switchArea(findFirstVisibleArea());
      }
    }

    areaButtons.forEach(button => {
      button.addEventListener('click', () => {
        const area = button.dataset.area;
        if (!area) return;
        switchArea(area);
      });
    });

    // Garment selection modal
    const garmentModalOverlay = document.getElementById('garment-modal-overlay');
    const garmentModalStart = document.getElementById('garment-modal-start');
    const garmentModalClose = document.getElementById('garment-modal-close');
    const garmentCards = document.querySelectorAll('.garment-card');

    function openGarmentModal() {
      if (!garmentModalOverlay) return;
      garmentModalOverlay.style.display = 'flex';
      garmentModalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeGarmentModal() {
      if (!garmentModalOverlay) return;
      garmentModalOverlay.style.display = 'none';
      garmentModalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function selectGarmentType(type) {
      if (!type || type === productType) return;
      productType = type;
      if (urlProduct && getGarmentTypeOfProduct(urlProduct) === productType) {
        currentProduct = urlProduct;
      } else {
        currentProduct = GENERIC_CUSTOM_PRODUCTS[productType];
      }

      document.querySelectorAll('.co-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === productType);
      });

      if (floatingName) floatingName.textContent = currentProduct.name;
      if (floatingCat) floatingCat.textContent = currentProduct.category || 'Apparel';
      document.title = `Personnaliser ${currentProduct.name} — AIZO.DZ`;
      updateGarmentBackground();
      updateAreaButtonsVisibility();
      renderProductPreview();
      fitCanvasToContainer();
    }

    garmentCards.forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        selectGarmentType(type);
        garmentCards.forEach(c => c.classList.toggle('active', c === card));
      });
    });

    garmentModalStart?.addEventListener('click', closeGarmentModal);
    garmentModalClose?.addEventListener('click', closeGarmentModal);
    garmentModalOverlay?.addEventListener('click', (event) => {
      if (event.target === garmentModalOverlay) {
        closeGarmentModal();
      }
    });

    // Auto-open modal on first page visit when the modal exists
    if (garmentModalOverlay) {
      openGarmentModal();
    }

    // Garment color swatches
    document.querySelectorAll('.co-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.co-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        garmentColor = swatch.dataset.color;
        garmentColorName = COLOR_NAMES[garmentColor] || garmentColor;
        
        // Update all canvases colors
        updateGarmentBackground();
      });
    });

    // Garment size selector
    document.querySelectorAll('.co-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.co-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        garmentSize = btn.dataset.size;
      });
    });

    // Production method selection (Embroidery enabled, Print disabled)
    document.querySelectorAll('.co-service-btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.co-service-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        productionMethod = btn.dataset.service;
      });
    });

    // Design File Upload Click
    const uploadBtn = document.getElementById('co-upload-btn');
    const fileInput = document.getElementById('co-file-input');
    const dragZone = document.getElementById('co-upload-dragzone');

    uploadBtn.addEventListener('click', () => fileInput.click());
    dragZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', handleFileUpload);

    // Setup drag & drop
    dragZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dragZone.classList.add('dragover');
    });

    dragZone.addEventListener('dragleave', () => {
      dragZone.classList.remove('dragover');
    });

    dragZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dragZone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        handleFileUpload({ target: fileInput });
      }
    });

    // Delete selected design
    const deleteBtn = document.getElementById('co-delete-btn');
    deleteBtn.addEventListener('click', deleteSelectedObject);

    // Initial buttons setup
    updateAreaButtonsVisibility();
    openGarmentModal();
  }

  function updateAreaTabsVisibility() {
    const buttons = document.querySelectorAll('.co-area-button');
    let firstVisible = null;

    buttons.forEach(button => {
      const area = button.dataset.area;
      const visible = isAreaVisible(area);
      button.style.display = visible ? '' : 'none';
      if (visible && !firstVisible) {
        firstVisible = button;
      }
    });

    const currentButton = Array.from(buttons).find(button => button.dataset.area === currentArea);
    if (!currentButton || currentButton.style.display === 'none') {
      const nextArea = firstVisible ? firstVisible.dataset.area : 'Center';
      switchArea(nextArea);
    } else {
      updateAreaButtonsVisibility();
    }
  }

  // ── Step Navigation ──
  async function goToStep(step) {
    if (step < 1 || step > 3) return;

    // Validation
    if (step > currentStep) {
      if (currentStep === 2 && !validateCustomerForm()) return;
      if (step === 3 && !hasAnyDesigns()) {
        alert('يرجى تحميل تصميم واحد على الأقل قبل تأكيد الطلب.');
        return;
      }
    }

    // Canvas save when switching panels
    if (currentStep === 1) {
      saveCurrentArea();
    }

    if (step === 3) {
      await buildOrderSummary();
    }

    currentStep = step;
    updateStepUI();
  }

  function updateStepUI() {
    // Show active panel
    document.querySelectorAll('.co-control-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`co-panel-${currentStep}`);
    if (panel) panel.classList.add('active');

    // Update steps indicator
    document.querySelectorAll('.co-step').forEach(s => {
      const sStep = parseInt(s.dataset.step);
      s.classList.toggle('active', sStep === currentStep);
      s.classList.toggle('done', sStep < currentStep);
    });

    // Nav footer buttons
    const prevBtn = document.getElementById('co-prev');
    const nextBtn = document.getElementById('co-next');
    const submitBtn = document.getElementById('co-submit');

    prevBtn.style.display = currentStep > 1 ? '' : 'none';
    nextBtn.style.display = currentStep < 3 ? '' : 'none';
    submitBtn.style.display = currentStep === 3 ? '' : 'none';

    // Auto-scroll window to top of controls
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  // ── Customer Info Validation ──
  function validateCustomerForm() {
    try {
      const nameEl = document.getElementById('co-name');
      const surnameEl = document.getElementById('co-surname');
      const emailEl = document.getElementById('co-email');
      const phoneEl = document.getElementById('co-phone');
      const provinceEl = document.getElementById('co-province');

      if (!nameEl || !surnameEl || !emailEl || !phoneEl || !provinceEl) {
        console.error('Form validation: One or more input elements are missing from the page');
        return false;
      }

      const name = nameEl.value.trim();
      const surname = surnameEl.value.trim();
      const email = emailEl.value.trim();
      const phone = phoneEl.value.trim();
      const province = provinceEl.value;

      let isValid = true;

      if (!name) { highlightErrorField('co-name'); isValid = false; }
      if (!surname) { highlightErrorField('co-surname'); isValid = false; }
      if (!email || !email.includes('@')) { highlightErrorField('co-email'); isValid = false; }
      if (!phone || phone.length < 9) { highlightErrorField('co-phone'); isValid = false; }
      if (!province) { highlightErrorField('co-province'); isValid = false; }

      return isValid;
    } catch (err) {
      console.error('Error in validateCustomerForm:', err);
      return false;
    }
  }

  function highlightErrorField(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('co-error');
      const removeErr = () => el.classList.remove('co-error');
      el.addEventListener('input', removeErr, { once: true });
      el.addEventListener('change', removeErr, { once: true });
    }
  }

  // ── Fabric.js Canvas Engine ──
  function initFabricCanvas() {
    const canvasEl = document.getElementById('co-canvas');
    fabricCanvas = new fabric.Canvas(canvasEl, {
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
      allowTouchScrolling: false,
      enableRetinaScaling: false
    });
    canvasEl.style.touchAction = 'none';
    canvasEl.style.msTouchAction = 'none';
    canvasEl.style.userSelect = 'none';
    canvasEl.style.webkitUserSelect = 'none';
    if (fabricCanvas.upperCanvasEl) {
      fabricCanvas.upperCanvasEl.style.touchAction = 'none';
      fabricCanvas.upperCanvasEl.style.msTouchAction = 'none';
      fabricCanvas.upperCanvasEl.style.userSelect = 'none';
    }
    if (fabricCanvas.lowerCanvasEl) {
      fabricCanvas.lowerCanvasEl.style.touchAction = 'none';
      fabricCanvas.lowerCanvasEl.style.msTouchAction = 'none';
      fabricCanvas.lowerCanvasEl.style.userSelect = 'none';
    }

    // Make object controls easier to use on touch devices
    try {
      const isTouch = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
      fabric.Object.prototype.cornerSize = isTouch ? 30 : 10;
      fabric.Object.prototype.borderScaleFactor = 2.5;
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerStyle = 'circle';
      fabric.Object.prototype.borderColor = '#ffffff';
      fabric.Object.prototype.cornerColor = '#111827';
      fabric.Object.prototype.cornerStrokeColor = '#ffffff';
      fabric.Object.prototype.padding = isTouch ? 14 : 6;
      fabric.Object.prototype.touchCornerSize = isTouch ? 40 : 16;
    } catch (err) {
      // ignore if fabric API differs
      console.warn('Fabric defaults adjustment failed:', err);
    }

    // Dynamic sizing based on outer container
    // Use timeout to ensure layout is calculated on mobile
    setTimeout(() => {
      fitCanvasToContainer();
    }, 50);
    
    window.addEventListener('resize', debounce(fitCanvasToContainer, 150));
    // Re-calculate offset when device orientation changes (critical for mobile)
    window.addEventListener('orientationchange', () => {
      setTimeout(fitCanvasToContainer, 300);
    });

    // Initial garment render
    loadGarmentMockupBackground();

    // Event updates
    fabricCanvas.on('object:modified', () => {
      saveCurrentArea();
      renderActiveLayersUI();
    });

    fabricCanvas.on('selection:created', () => {
      toggleDeleteBtn(true);
    });

    fabricCanvas.on('selection:updated', () => {
      toggleDeleteBtn(true);
    });

    fabricCanvas.on('selection:cleared', () => {
      toggleDeleteBtn(false);
    });

    fabricCanvas.on('mouse:down', (opt) => {
      const target = opt.target;
      if (target && target.type === 'image') {
        fabricCanvas.setActiveObject(target);
      }
    });

    fabricCanvas.on('object:moving', () => {
      saveCurrentArea();
    });

    fabricCanvas.on('object:scaling', () => {
      saveCurrentArea();
    });

    // Add delete/backspace key listeners for easier object deletion
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
          deleteSelectedObject();
        }
      }
    });

    // Mobile pinch gesture scales the selected uploaded design only.
    const canvasOuter = document.getElementById('co-canvas-outer');
    let gestureState = {
      active: false,
      startDist: 0,
      startScale: 1,
      targetObj: null
    };

    function getTouchDistance(t1, t2) {
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function getCanvasTouchPoint(touch) {
      const rect = fabricCanvas.upperCanvasEl.getBoundingClientRect();
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }

    function findImageObjectAtPoint(point) {
      return fabricCanvas.getObjects().reverse().find(obj => {
        if (obj.type !== 'image' || obj.id === 'garmentBackground' || !obj.containsPoint) return false;
        return obj.containsPoint(point);
      });
    }

    if (canvasOuter) {
      canvasOuter.addEventListener('touchstart', (ev) => {
        if (ev.touches && ev.touches.length === 2 && fabricCanvas) {
          let activeObject = fabricCanvas.getActiveObject();
          if (!activeObject || activeObject.id === 'garmentBackground') {
            const p1 = getCanvasTouchPoint(ev.touches[0]);
            const p2 = getCanvasTouchPoint(ev.touches[1]);
            const centerPoint = {
              x: (p1.x + p2.x) / 2,
              y: (p1.y + p2.y) / 2
            };
            const hit = findImageObjectAtPoint(centerPoint);
            if (hit) {
              fabricCanvas.setActiveObject(hit);
              activeObject = hit;
            }
          }

          if (activeObject && activeObject.type === 'image' && activeObject.id !== 'garmentBackground') {
            ev.preventDefault();
            gestureState.active = true;
            gestureState.startDist = getTouchDistance(ev.touches[0], ev.touches[1]);
            gestureState.startScale = activeObject.scaleX || 1;
            gestureState.targetObj = activeObject;
          }
        }
      }, { passive: false });

      canvasOuter.addEventListener('touchmove', (ev) => {
        if (!gestureState.active || !ev.touches || ev.touches.length !== 2) return;
        const activeObject = gestureState.targetObj;
        if (!activeObject || !fabricCanvas) return;

        ev.preventDefault();
        const currentDist = getTouchDistance(ev.touches[0], ev.touches[1]);
        const scaleFactor = currentDist / gestureState.startDist;
        const nextScale = Math.max(0.2, Math.min(5, gestureState.startScale * scaleFactor));

        activeObject.set({
          scaleX: nextScale,
          scaleY: nextScale
        });
        activeObject.setCoords();
        fabricCanvas.requestRenderAll();
      }, { passive: false });

      canvasOuter.addEventListener('touchend', (ev) => {
        if (gestureState.active && (!ev.touches || ev.touches.length < 2)) {
          gestureState.active = false;
          gestureState.targetObj = null;
          saveCurrentArea();
          renderActiveLayersUI();
        }
      });

      canvasOuter.addEventListener('touchcancel', () => {
        if (gestureState.active) {
          gestureState.active = false;
          gestureState.targetObj = null;
          saveCurrentArea();
          renderActiveLayersUI();
        }
      });
    }
  }

  function fitCanvasToContainer() {
    const container = document.getElementById('co-canvas-outer');
    if (!container || !fabricCanvas) return;

    const mockupWrapper = container.closest('.co-mockup-wrapper');
    let parentWidth = mockupWrapper ? mockupWrapper.getBoundingClientRect().width : window.innerWidth;
    
    const isMobile = window.innerWidth <= 480;
    const padding = isMobile ? 16 : 32;
    let availableWidth = parentWidth - padding;
    if (availableWidth <= 0) availableWidth = 320;

    const designWidth = 480;
    const designHeight = 520;

    let scale = 1;
    if (availableWidth < designWidth) {
      scale = Math.max(availableWidth / designWidth, 0.65);
    } else {
      scale = Math.min(availableWidth / designWidth, 1.25);
    }

    const zoomedHeight = Math.round(designHeight * scale);
    const zoomedWidth = Math.round(designWidth * scale);

    container.style.setProperty('--canvas-container-height', zoomedHeight + 'px');
    container.style.setProperty('--canvas-container-width', zoomedWidth + 'px');
    container.style.setProperty('--canvas-scale', scale);

    fabricCanvas.setDimensions({
      width: zoomedWidth,
      height: zoomedHeight
    });
    fabricCanvas.setZoom(scale);

    fabricCanvas.calcOffset();
    drawPrintZoneGuide();
    fabricCanvas.requestRenderAll();
  }

  function toggleDeleteBtn(active) {
    const btn = document.getElementById('co-delete-btn');
    if (btn) btn.classList.toggle('active', active);
  }

  function saveCurrentArea() {
    if (fabricCanvas) {
      // Filter out guide rectangle and labels from JSON serialization
      const json = fabricCanvas.toJSON(['selectable', 'evented', 'rawSrc', 'layerId']);
      
      if (!areaCanvasData[currentArea]) {
        areaCanvasData[currentArea] = { json: null, rawDesigns: [] };
      }

      // Filter objects array in serialized JSON to keep only valid image designs
      if (json.objects) {
        json.objects = json.objects.filter(obj => 
          obj.id !== 'printZoneGuide' && 
          obj.id !== 'areaLabel' &&
          obj.id !== 'garmentBackground' &&
          obj.type === 'image' &&
          (obj.rawSrc || obj.src)
        );
        
        // Ensure rawSrc is preserved - if missing, try to restore from canvas
        json.objects = json.objects.map(obj => {
          if (!obj.rawSrc && obj.src) {
            // If rawSrc is missing but src exists, keep src
            return obj;
          }
          return obj;
        });
      }
      
      areaCanvasData[currentArea].json = json;
    }
  }

  function findFirstAreaWithDesigns() {
    return Object.keys(areaCanvasData).find(area => {
      if (area === currentArea && fabricCanvas) {
        return fabricCanvas.getObjects().some(o =>
          o.id !== 'printZoneGuide' &&
          o.id !== 'areaLabel' &&
          o.id !== 'garmentBackground' &&
          o.type === 'image' &&
          (o.rawSrc || o.src)
        );
      }
      const data = areaCanvasData[area];
      return data && data.json && Array.isArray(data.json.objects) && data.json.objects.some(o =>
        o.type === 'image' &&
        (o.rawSrc || o.src)
      );
    });
  }

  function hasAnyDesigns() {
    return Boolean(findFirstAreaWithDesigns());
  }

  function switchArea(area) {
    if (area === currentArea) return;

    // Save active state
    saveCurrentArea();

    currentArea = area;
    updateSelectedAreaLabel();

    // Update active selector buttons
    document.querySelectorAll('.co-area-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.area === area);
    });

    // Redraw mockup background
    loadGarmentMockupBackground();

    // Clean canvas layers
    fabricCanvas.clear();
    drawPrintZoneGuide();

    // Restore layers
    const areaData = areaCanvasData[area];
    if (areaData.json && areaData.json.objects && areaData.json.objects.length > 0) {
      fabricCanvas.loadFromJSON(areaData.json, () => {
        // Redraw Guide Rect & send it to back
        drawPrintZoneGuide();
        
        // Re-align raw images for active layers
        fabricCanvas.requestRenderAll();
        renderActiveLayersUI();
      });
    } else {
      renderActiveLayersUI();
    }
  }

  function updateGarmentBackground() {
    loadGarmentMockupBackground();
    renderProductPreview();
    updateSelectedAreaLabel();
  }

  function getAreaDisplayName(area) {
    const names = {
      Center: 'Centre poitrine',
      ChestLeft: 'Poitrine gauche',
      ChestRight: 'Poitrine droite',
      Back: 'Dos',
      SleeveRight: 'Manche droite',
      SleeveLeft: 'Manche gauche'
    };
    return names[area] || area;
  }

  function updateSelectedAreaLabel() {
    const label = document.getElementById('co-selected-area-label');
    if (!label) return;
    label.textContent = `Zone active : ${getAreaDisplayName(currentArea)}`;
  }

  function renderProductPreview() {
    const previewLabel = document.getElementById('co-product-preview-title');
    const previewImage = document.getElementById('co-product-preview-image');
    if (!previewImage) return;

    const previewArea = currentArea === 'Back' ? 'Back' : currentArea.includes('Sleeve') ? currentArea : 'Center';
    const svgString = generateGarmentSVG(productType, previewArea, '#ffffff');
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

    previewImage.style.backgroundImage = `url('${dataUrl}')`;
    previewImage.style.backgroundSize = 'contain';
    previewImage.style.backgroundPosition = 'center';
    previewImage.style.backgroundRepeat = 'no-repeat';

    if (previewLabel) {
      previewLabel.textContent = '';
    }
  }

  // ── Vector Outlines Generators (SVGs) ──
  function loadGarmentMockupBackground() {
    if (!fabricCanvas) return;
    
    const svgString = generateGarmentSVG(productType, currentArea, garmentColor);
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

    fabric.Image.fromURL(dataUrl, (img) => {
      // Always scale the background relative to the base design coordinates (480x520)
      const designWidth = 480;
      const designHeight = 520;
      const garmentScale = 0.96;
      const bgWidth = Math.round(designWidth * garmentScale);
      const bgHeight = Math.round(designHeight * garmentScale);
      const bgLeft = Math.round((designWidth - bgWidth) / 2);
      const bgTop = Math.max(8, Math.round(designHeight - bgHeight - 16));
      img.set({
        left: bgLeft,
        top: bgTop,
        width: bgWidth,
        height: bgHeight,
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        lockUniScaling: true,
        id: 'garmentBackground'
      });
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
    });
  }

  function generateGarmentSVG(type, area, color) {
    let view = 'front';
    if (area === 'Back') {
      view = 'back';
    } else if (area === 'SleeveRight') {
      view = 'sleeve-right';
    } else if (area === 'SleeveLeft') {
      view = 'sleeve-left';
    }

    // Base template
    let paths = '';
    const w = 480;
    const h = 520;

    if (type === 'hoodie') {
      if (view === 'front') {
        paths = `
          <!-- Body and Hood base -->
          <path d="M 120 120 L 160 80 C 180 120, 300 120, 320 80 L 360 120 L 430 420 L 390 435 L 340 230 L 340 460 C 340 470, 330 480, 320 480 L 160 480 C 150 480, 140 470, 140 460 L 140 230 L 90 435 L 50 420 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <!-- Hoodie Kangaroo Pocket -->
          <path d="M 170 340 L 310 340 L 330 420 L 150 420 Z" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="3" stroke-linejoin="round"/>
          <path d="M 170 340 L 150 420 M 310 340 L 330 420" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>
          <!-- Hood outline -->
          <path d="M 160 80 C 140 0, 340 0, 320 80 C 310 100, 170 100, 160 80 Z" fill="${color}" stroke="#1e1e1e" stroke-width="3"/>
          <path d="M 220 85 C 235 95, 245 95, 260 85" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="3"/>
          <!-- Drawstrings -->
          <path d="M 230 90 L 230 180 M 250 90 L 250 170" stroke="#f5f5f5" stroke-width="4" stroke-linecap="round"/>
          <circle cx="230" cy="180" r="3" fill="#888"/>
          <circle cx="250" cy="170" r="3" fill="#888"/>
          <!-- Sleeves lines -->
          <path d="M 140 160 L 90 435 M 340 160 L 390 435" stroke="rgba(0,0,0,0.2)" stroke-width="3"/>
          <!-- Ribbed Hem -->
          <rect x="140" y="465" width="200" height="15" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
          <!-- Wrist Cuffs -->
          <rect x="50" y="418" width="40" height="12" transform="rotate(-20 50 418)" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)"/>
          <rect x="390" y="418" width="40" height="12" transform="rotate(20 390 418)" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)"/>
        `;
      } else if (view === 'back') {
        paths = `
          <path d="M 120 120 L 160 80 C 180 90, 300 90, 320 80 L 360 120 L 430 420 L 390 435 L 340 230 L 340 460 C 340 470, 330 480, 320 480 L 160 480 C 150 480, 140 470, 140 460 L 140 230 L 90 435 L 50 420 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <!-- Hood draped down back -->
          <path d="M 160 80 C 180 50, 300 50, 320 80 C 310 170, 170 170, 160 80 Z" fill="${color}" stroke="#1e1e1e" stroke-width="3"/>
          <path d="M 190 120 C 210 145, 270 145, 290 120" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
          <!-- Ribbed Hem -->
          <rect x="140" y="465" width="200" height="15" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
          <!-- Wrist Cuffs -->
          <rect x="50" y="418" width="40" height="12" transform="rotate(-20 50 418)" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)"/>
          <rect x="390" y="418" width="40" height="12" transform="rotate(20 390 418)" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)"/>
        `;
      } else {
        // Sleeve zoomed view (represents both left and right sleeves)
        paths = `
          <!-- Sleeve profile centered -->
          <path d="M 240 60 L 130 90 L 150 420 L 330 420 L 350 90 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <!-- Shoulder cap fold -->
          <path d="M 130 90 C 200 40, 280 40, 350 90" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="3"/>
          <!-- Cuff Ribbed -->
          <rect x="150" y="405" width="180" height="15" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
          <!-- Arm fold wrinkles -->
          <path d="M 140 180 Q 240 200, 340 180 M 145 280 Q 240 295, 335 280" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2"/>
        `;
      }
    } else if (type === 'cap') {
      if (view === 'front') {
        paths = `
          <!-- Cap Crown -->
          <path d="M 160 250 C 150 140, 330 140, 320 250 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <!-- Front Panel Stitching -->
          <path d="M 240 142 C 240 180, 240 210, 240 250" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
          <path d="M 160 250 C 190 200, 290 200, 320 250" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
          <!-- Cap Brim / Visor -->
          <path d="M 150 248 C 130 290, 350 290, 330 248 C 290 265, 190 265, 150 248 Z" fill="${color}" stroke="#1e1e1e" stroke-width="3" stroke-linejoin="round"/>
          <!-- Top Button -->
          <circle cx="240" cy="142" r="8" fill="${color}" stroke="#1e1e1e" stroke-width="2"/>
        `;
      } else {
        // Back view
        paths = `
          <!-- Cap Crown Back -->
          <path d="M 160 250 C 150 140, 330 140, 320 250 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <!-- Snapback Opening -->
          <path d="M 200 250 C 200 220, 280 220, 280 250 Z" fill="#fafaf9" stroke="#1e1e1e" stroke-width="3"/>
          <!-- Plastic Strap -->
          <rect x="202" y="242" width="76" height="8" rx="2" fill="#292524" stroke="#1c1917" stroke-width="1"/>
          <!-- Top Button -->
          <circle cx="240" cy="142" r="8" fill="${color}" stroke="#1e1e1e" stroke-width="2"/>
        `;
      }
    } else if (type === 'bob') {
      paths = `
        <!-- Crown Top -->
        <path d="M 180 170 C 190 155, 290 155, 300 170 L 315 225 L 165 225 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
        <!-- Crown Stitch Line -->
        <path d="M 165 225 C 190 230, 290 230, 315 225" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
        <!-- Brim -->
        <path d="M 165 225 L 130 265 C 170 285, 310 285, 350 265 L 315 225 C 290 235, 190 235, 165 225 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
        <!-- Brim Stitch lines (Bucket hat style) -->
        <path d="M 140 255 C 175 270, 305 270, 340 255" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
        <path d="M 150 245 C 180 258, 300 258, 330 245" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
      `;
    } else if (type === 'jogging') {
      paths = `
        <!-- Waistband -->
        <rect x="170" y="110" width="140" height="20" rx="3" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
        <!-- Drawstrings -->
        <path d="M 235 125 L 230 160 M 245 125 L 250 165" stroke="#f5f5f5" stroke-width="3" stroke-linecap="round"/>
        <!-- Pants Body -->
        <path d="M 170 125 L 140 280 L 175 450 L 210 450 L 240 230 L 270 450 L 305 450 L 340 280 L 310 125 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
        <!-- Ribbed Cuffs -->
        <rect x="175" y="450" width="35" height="15" fill="rgba(0,0,0,0.1)" stroke="#1e1e1e" stroke-width="2"/>
        <rect x="270" y="450" width="35" height="15" fill="rgba(0,0,0,0.1)" stroke="#1e1e1e" stroke-width="2"/>
        <!-- Crotch seam -->
        <path d="M 240 125 L 240 230" stroke="rgba(0,0,0,0.2)" stroke-width="3"/>
        <!-- Pockets -->
        <path d="M 165 145 C 160 180, 150 195, 145 200" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
        <path d="M 315 145 C 320 180, 330 195, 335 200" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
      `;
    } else if (type === 'short') {
      paths = `
        <!-- Waistband -->
        <rect x="170" y="110" width="140" height="20" rx="3" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
        <!-- Drawstrings -->
        <path d="M 235 125 L 230 160 M 245 125 L 250 165" stroke="#f5f5f5" stroke-width="3" stroke-linecap="round"/>
        <!-- Shorts Body -->
        <path d="M 170 125 L 145 260 L 225 260 L 240 200 L 255 260 L 335 260 L 310 125 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
        <!-- Crotch & fly seam -->
        <path d="M 240 125 L 240 200" stroke="rgba(0,0,0,0.2)" stroke-width="3"/>
        <!-- Hems -->
        <path d="M 145 255 L 225 255 M 255 255 L 335 255" stroke="rgba(0,0,0,0.25)" stroke-width="2"/>
        <!-- Pockets -->
        <path d="M 165 145 Q 160 170, 155 180" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
        <path d="M 315 145 Q 320 170, 325 180" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
      `;
    } else if (type === 'polo') {
      if (view === 'front') {
        paths = `
          <path d="M 110 110 L 180 60 C 190 85, 290 85, 300 60 L 370 110 L 420 200 L 370 230 L 340 210 L 340 460 C 340 470, 330 480, 320 480 L 160 480 C 150 480, 140 470, 140 460 L 140 210 L 110 230 L 60 200 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <!-- Polo Collar -->
          <path d="M 180 60 L 220 120 L 240 120 L 240 60 Z" fill="${color}" stroke="#1e1e1e" stroke-width="2"/>
          <path d="M 300 60 L 260 120 L 240 120 L 240 60 Z" fill="${color}" stroke="#1e1e1e" stroke-width="2"/>
          <!-- Placket (Buttons area) -->
          <path d="M 225 120 L 225 210 L 255 210 L 255 120 Z" fill="rgba(0,0,0,0.05)" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
          <!-- Buttons -->
          <circle cx="240" cy="140" r="3" fill="#f5f5f5" stroke="#ccc"/>
          <circle cx="240" cy="170" r="3" fill="#f5f5f5" stroke="#ccc"/>
          <circle cx="240" cy="195" r="3" fill="#f5f5f5" stroke="#ccc"/>
          <!-- Sleeve Hems -->
          <path d="M 60 200 L 110 230 M 420 200 L 370 230" stroke="rgba(0,0,0,0.25)" stroke-width="2"/>
        `;
      } else if (view === 'back') {
        paths = `
          <path d="M 110 110 L 180 60 C 190 70, 290 70, 300 60 L 370 110 L 420 200 L 370 230 L 340 210 L 340 460 C 340 470, 330 480, 320 480 L 160 480 C 150 480, 140 470, 140 460 L 140 210 L 110 230 L 60 200 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <!-- Back Collar -->
          <path d="M 180 60 C 210 75, 270 75, 300 60 Z" fill="${color}" stroke="#1e1e1e" stroke-width="2"/>
        `;
      } else {
        // Sleeve zoomed view
        paths = `
          <path d="M 240 80 L 110 120 L 140 380 L 340 380 L 370 120 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <path d="M 110 120 C 190 70, 290 70, 370 120" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="3"/>
          <!-- Polo Ribbed Cuff -->
          <rect x="140" y="355" width="200" height="25" fill="rgba(0,0,0,0.08)" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
        `;
      }
    } else {
      // DEFAULT: T-Shirt
      if (view === 'front') {
        paths = `
          <!-- T-shirt base path -->
          <path d="M 110 110 L 175 60 C 195 80, 285 80, 305 60 L 370 110 L 430 190 L 375 220 L 340 200 L 340 460 C 340 470, 330 480, 320 480 L 160 480 C 150 480, 140 470, 140 460 L 140 200 L 105 220 L 50 190 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <!-- Neck Line -->
          <path d="M 175 60 C 195 80, 285 80, 305 60" fill="none" stroke="#1e1e1e" stroke-width="3"/>
          <path d="M 170 55 C 195 75, 285 75, 310 55" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
          <!-- Sleeve details -->
          <path d="M 105 200 Q 120 205, 140 200 M 375 200 Q 360 205, 340 200" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
        `;
      } else if (view === 'back') {
        paths = `
          <path d="M 110 110 L 175 60 C 195 68, 285 68, 305 60 L 370 110 L 430 190 L 375 220 L 340 200 L 340 460 C 340 470, 330 480, 320 480 L 160 480 C 150 480, 140 470, 140 460 L 140 200 L 105 220 L 50 190 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <!-- Higher neckline -->
          <path d="M 175 60 C 195 68, 285 68, 305 60" fill="none" stroke="#1e1e1e" stroke-width="3"/>
        `;
      } else {
        // Sleeve view
        paths = `
          <path d="M 240 80 L 110 120 L 140 380 L 340 380 L 370 120 Z" fill="${color}" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round"/>
          <path d="M 110 120 C 190 70, 290 70, 370 120" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="3"/>
          <path d="M 140 370 L 340 370" stroke="rgba(0,0,0,0.25)" stroke-width="2"/>
        `;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <!-- Background subtle grid pattern for contrast (translucent) -->
      <defs>
        <pattern id="checkers" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="rgba(255,255,255,0.03)" />
          <rect x="10" width="10" height="10" fill="rgba(0,0,0,0.03)" />
          <rect y="10" width="10" height="10" fill="rgba(0,0,0,0.03)" />
        </pattern>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#checkers)" />
      
      <!-- Shadows -->
      <g filter="blur(6px)" opacity="0.4">
        <ellipse cx="${w/2}" cy="${h - 25}" rx="140" ry="10" fill="#000" />
      </g>
      
      <!-- Garment -->
      <g>
        ${paths}
      </g>
    </svg>`;
  }

  // ── Print Zone Dashed Guide ──
  function drawPrintZoneGuide() {
    return;
  }

  // Helper to downscale large base64 PNG images to max 1000px dimension
  // to reduce network transfer time and prevent quota exceeded storage issues.
  function resizeImageIfNeeded(base64Str, maxDim = 1000) {
    return new Promise((resolve) => {
      if (!base64Str || typeof base64Str !== 'string' || base64Str.indexOf('data:image/') !== 0) {
        resolve(base64Str);
        return;
      }
      
      const img = new Image();
      img.onload = function() {
        if (img.width <= maxDim && img.height <= maxDim) {
          resolve(base64Str); // No resize needed
          return;
        }
        
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = function() {
        resolve(base64Str); // Fallback to original
      };
      img.src = base64Str;
    });
  }

  // ── Image Upload & Canvas Actions ──
  function handleFileUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Format de fichier invalide. Veuillez importer un fichier image (PNG transparent de préférence).');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (evt) {
        const base64Data = evt.target.result;
        
        // Downscale image if too large to speed up upload & prevent quota issues
        resizeImageIfNeeded(base64Data, 1000).then(resizedBase64 => {
          fabric.Image.fromURL(resizedBase64, function (img) {
            // Fit scale to canvas guide
            const configs = PRINT_ZONE_CONFIGS[productType] || PRINT_ZONE_CONFIGS.tshirt;
            const config = configs[currentArea] || configs.Center;
            const scaleX = 1;
            const scaleY = 1;
            
            const targetW = config.width * scaleX * 0.8;
            const targetH = config.height * scaleY * 0.8;
            const scale = Math.min(targetW / img.width, targetH / img.height, 1);
            
            const uniqueId = 'layer_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

            img.set({
              scaleX: scale,
              scaleY: scale,
              originX: 'center',
              originY: 'center',
              left: (config.left * scaleX) + (config.width * scaleX) / 2,
              top: (config.top * scaleY) + (config.height * scaleY) / 2,
              cornerStyle: 'circle',
              cornerColor: '#ffffff',
              cornerStrokeColor: '#1e1e1e',
              cornerSize: 26,
              padding: 12,
              transparentCorners: false,
              borderColor: '#ffffff',
              borderScaleFactor: 1.5,
              rawSrc: resizedBase64, // Save optimized base64 for API submission
              layerId: uniqueId,
              area: currentArea,
              selectable: true,
              evented: true,
              hasControls: true,
              hasBorders: true,
              lockMovementX: false,
              lockMovementY: false,
              lockScalingX: false,
              lockScalingY: false,
              lockRotation: false,
              lockUniScaling: false,
              lockScalingFlip: true,
              objectCaching: false,
              perPixelTargetFind: true
            });
            img.setControlsVisibility({
              tl: true,
              tr: true,
              bl: true,
              br: true,
              ml: false,
              mr: false,
              mt: false,
              mb: false,
              mtr: false
            });

            fabricCanvas.add(img);
            fabricCanvas.setActiveObject(img);
            fabricCanvas.requestRenderAll();

            // Save area state
            saveCurrentArea();
            renderActiveLayersUI();
          });
        });
      };
      
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  }

  function deleteSelectedObject() {
    if (!fabricCanvas) return;
    const active = fabricCanvas.getActiveObjects();
    if (active.length > 0) {
      active.forEach(obj => {
        if (obj.id !== 'printZoneGuide' && obj.id !== 'areaLabel' && obj.id !== 'garmentBackground') {
          fabricCanvas.remove(obj);
        }
      });
      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
      
      // Save area state
      saveCurrentArea();
      renderActiveLayersUI();
    }
  }

  // ── Render Layer List UI ──
  function renderActiveLayersUI() {
    const listContainer = document.getElementById('co-layers-list');
    const section = document.getElementById('co-layers-section');
    const countSpan = document.getElementById('co-layers-count');
    
    if (!listContainer) return;

    // Compile active layers across all areas
    const activeLayers = [];
    
    // Check current canvas layers
    if (fabricCanvas) {
      const currentCanvasLayers = fabricCanvas.getObjects().filter(obj => 
        obj.id !== 'printZoneGuide' && 
        obj.id !== 'areaLabel' && 
        obj.id !== 'garmentBackground' &&
        obj.type === 'image' &&
        (obj.rawSrc || obj.src)
      );
      
      currentCanvasLayers.forEach((obj, idx) => {
        activeLayers.push({
          id: obj.layerId,
          area: currentArea,
          scale: Math.round((obj.scaleX || 1) * 100),
          rotation: Math.round(obj.angle || 0),
          img: obj.rawSrc || obj.src,
          left: Math.round(obj.left || 0),
          top: Math.round(obj.top || 0),
          canvasObject: obj
        });
      });
    }

    // Add other saved areas
    for (const [area, data] of Object.entries(areaCanvasData)) {
      if (area === currentArea) continue; // already processed
      if (data.json && data.json.objects) {
        data.json.objects.forEach((obj, idx) => {
          if (obj.type === 'image' && (obj.rawSrc || obj.src)) {
            activeLayers.push({
              id: obj.layerId,
              area: area,
              scale: Math.round((obj.scaleX || 1) * 100),
              rotation: Math.round(obj.angle || 0),
              img: obj.rawSrc || obj.src,
              left: Math.round(obj.left || 0),
              top: Math.round(obj.top || 0)
            });
          }
        });
      }
    }

    countSpan.textContent = activeLayers.length;
    section.style.display = activeLayers.length > 0 ? 'block' : 'none';

    if (activeLayers.length === 0) {
      listContainer.innerHTML = '';
      return;
    }

    const areaTranslation = {
      Center: 'Centre poitrine / وسط الصدر',
      ChestLeft: 'Poitrine Gauche / صدر يسار',
      ChestRight: 'Poitrine Droite / صدر يمين',
      Back: 'Dos / الظهر',
      SleeveRight: 'Manche Droite / كم أيمن',
      SleeveLeft: 'Manche Gauche / كم أيسر'
    };

    listContainer.innerHTML = activeLayers.map((layer, idx) => {
      const areaLabel = areaTranslation[layer.area] || layer.area || 'Zone inconnue';
      return `
      <div class="co-layer-item">
        <img class="co-layer-thumb" src="${layer.img}" alt="Logo layer ${idx + 1}" />
        <div class="co-layer-info">
          <span class="co-layer-area">${areaLabel}</span>
          <span class="co-layer-specs">Taille: ${layer.scale}% | Rotation: ${layer.rotation}°</span>
          <span class="co-layer-specs">Position: ${layer.left}px × ${layer.top}px</span>
        </div>
        <button class="co-layer-delete-btn" data-id="${layer.id}" data-area="${layer.area}" title="Supprimer">×</button>
      </div>
    `;
    }).join('');

    // Bind deletes
    listContainer.querySelectorAll('.co-layer-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const area = btn.dataset.area;
        
        if (area === currentArea && fabricCanvas) {
          const obj = fabricCanvas.getObjects().find(o => o.layerId === id);
          if (obj) {
            fabricCanvas.remove(obj);
            fabricCanvas.requestRenderAll();
            saveCurrentArea();
          }
        } else {
          // Remove from stored JSON
          const data = areaCanvasData[area];
          if (data.json && data.json.objects) {
            data.json.objects = data.json.objects.filter(o => o.layerId !== id);
          }
        }

        renderActiveLayersUI();
      });
    });
  }

  // ── Build Summary Step 3 ──
  async function generateOrderMockupSnapshot(snapshotArea) {
    // ⚡ Fast path optimization: if active fabricCanvas is available, take snapshot instantly
    if (fabricCanvas) {
      try {
        const guides = fabricCanvas.getObjects().filter(o => 
          o.id === 'printZoneGuide' || 
          o.id === 'areaLabel' || 
          o.id === 'garmentBackground'
        );
        
        // Hide guide layers
        guides.forEach(g => g.set('opacity', 0));
        fabricCanvas.renderAll();
        
        // Render at slightly lower quality (0.6) for faster serialization and upload
        const dataUrl = fabricCanvas.toDataURL({
          format: 'png',
          quality: 0.6
        });
        
        // Restore guide layers
        guides.forEach(g => g.set('opacity', 1));
        fabricCanvas.renderAll();
        
        console.log('[Fast Mockup Snapshot] Generated successfully in <10ms');
        return dataUrl;
      } catch (fastErr) {
        console.warn('[Fast Mockup Snapshot] active canvas snapshot failed, falling back to static canvas:', fastErr);
      }
    }

    return new Promise((resolve, reject) => {
      try {
        const tempEl = document.createElement('canvas');
        tempEl.width = 480;
        tempEl.height = 520;
        const tempCanvas = new fabric.StaticCanvas(tempEl, { enableRetinaScaling: false });

        const svgString = generateGarmentSVG(productType, snapshotArea, garmentColor);
        if (!svgString) {
          console.warn('SVG string is empty');
          return resolve('');
        }
        
        const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

        fabric.Image.fromURL(dataUrl, (bgImg) => {
          try {
            const garmentScale = 0.96;
            const bgWidth = Math.round(480 * garmentScale);
            const bgHeight = Math.round(520 * garmentScale);
            const bgLeft = Math.round((480 - bgWidth) / 2);
            const bgTop = Math.max(8, Math.round(520 - bgHeight - 16));
            bgImg.set({
              left: bgLeft,
              top: bgTop,
              width: bgWidth,
              height: bgHeight,
              selectable: false,
              evented: false
            });
            tempCanvas.setBackgroundImage(bgImg, tempCanvas.renderAll.bind(tempCanvas));

            let objects = [];
            if (snapshotArea === currentArea && fabricCanvas) {
              objects = fabricCanvas.getObjects().filter(o =>
                o.id !== 'printZoneGuide' &&
                o.id !== 'areaLabel' &&
                o.id !== 'garmentBackground' &&
                o.type === 'image' &&
                (o.rawSrc || o.src)
              );
            } else {
              const areaData = areaCanvasData[snapshotArea];
              if (areaData && areaData.json && areaData.json.objects) {
                objects = areaData.json.objects.filter(o =>
                  o.type === 'image' &&
                  (o.rawSrc || o.src)
                );
              }
            }

            if (objects.length === 0) {
              resolve(tempCanvas.toDataURL({ format: 'png', quality: 0.9 }));
              return;
            }

            let loaded = 0;
            const finalizeSnapshot = () => {
              tempCanvas.renderAll();
              resolve(tempCanvas.toDataURL({ format: 'png', quality: 0.9 }));
            };

            objects.forEach(obj => {
              const imageUrl = obj.rawSrc || obj.src;
              const imgEl = new Image();
              imgEl.crossOrigin = 'anonymous';

              imgEl.onload = () => {
                try {
                  const img = new fabric.Image(imgEl, {
                    left: obj.left || 0,
                    top: obj.top || 0,
                    scaleX: obj.scaleX || 1,
                    scaleY: obj.scaleY || 1,
                    angle: obj.angle || 0,
                    flipX: obj.flipX || false,
                    flipY: obj.flipY || false,
                    originX: obj.originX || 'left',
                    originY: obj.originY || 'top',
                    selectable: false,
                    evented: false
                  });
                  tempCanvas.add(img);
                } catch (imgErr) {
                  console.warn('Error adding image to snapshot:', imgErr);
                }
                loaded += 1;
                if (loaded === objects.length) finalizeSnapshot();
              };

              imgEl.onerror = () => {
                console.warn('Custom order snapshot image failed to load:', imageUrl);
                loaded += 1;
                if (loaded === objects.length) finalizeSnapshot();
              };

              imgEl.src = imageUrl;
            });
          } catch (err) {
            console.error('Error in snapshot generation:', err);
            reject(err);
          }
        }, { crossOrigin: 'anonymous' });
      } catch (err) {
        console.error('Error creating snapshot canvas:', err);
        reject(err);
      }
    });
  }

  async function buildOrderSummary() {
    // Generate base64 screenshot of a valid mockup area with designs
    const summaryImg = document.getElementById('co-summary-img');
    if (fabricCanvas && summaryImg) {
      const snapshotArea = findFirstAreaWithDesigns() || currentArea;
      summaryImg.src = await generateOrderMockupSnapshot(snapshotArea);
    }

    // Set values in summary fields
    document.getElementById('co-sum-product').textContent = currentProduct.name;
    document.getElementById('co-sum-color').textContent = garmentColorName;
    document.getElementById('co-sum-size').textContent = garmentSize;
    document.getElementById('co-sum-service').textContent = productionMethod === 'Embroidery' ? 'Broderie / تطريز' : 'Impression / طباعة';
    
    // Placements
    const placements = [];
    let designsCount = 0;
    
    // Scan placement count - filter for image objects with design data
    for (const [area, data] of Object.entries(areaCanvasData)) {
      let count = 0;
      if (area === currentArea && fabricCanvas) {
        count = fabricCanvas.getObjects().filter(o => 
          o.id !== 'printZoneGuide' && 
          o.id !== 'areaLabel' && 
          o.id !== 'garmentBackground' &&
          o.type === 'image' &&
          (o.rawSrc || o.src)
        ).length;
      } else if (data.json && data.json.objects) {
        count = data.json.objects.filter(o => 
          o.type === 'image' && (o.rawSrc || o.src)
        ).length;
      }
      
      if (count > 0) {
        placements.push(area);
        designsCount += count;
      }
    }

    const areaTranslationEN = {
      Center: 'Center Chest',
      ChestLeft: 'Left Chest',
      ChestRight: 'Right Chest',
      Back: 'Back',
      SleeveRight: 'Right Sleeve',
      SleeveLeft: 'Left Sleeve'
    };

    const placementLabels = placements.map(p => areaTranslationEN[p] || p).join(', ');
    document.getElementById('co-sum-placements').textContent = placementLabels || 'Néant';
    document.getElementById('co-sum-designs-count').textContent = designsCount;

    // Build design list view for summary
    const designsList = document.getElementById('co-sum-designs-list');
    const designsLabel = document.getElementById('co-sum-designs-label');
    if (designsList && designsLabel) {
      designsLabel.textContent = designsCount === 0 ? 'Aucun design' : `${designsCount} design(s)`;
      const allDesigns = [];
      for (const [area, data] of Object.entries(areaCanvasData)) {
        let objects = [];
        if (area === currentArea && fabricCanvas) {
          objects = fabricCanvas.getObjects().filter(o =>
            o.id !== 'printZoneGuide' &&
            o.id !== 'areaLabel' &&
            o.id !== 'garmentBackground' &&
            o.type === 'image' &&
            (o.rawSrc || o.src)
          );
        } else if (data.json && data.json.objects) {
          objects = data.json.objects.filter(o => o.type === 'image' && (o.rawSrc || o.src));
        }
        objects.forEach((obj, idx) => {
          allDesigns.push({
            id: obj.layerId || `${area}_${idx}`,
            area: obj.area || area,
            img: obj.rawSrc || obj.src,
            scale: Math.round((obj.scaleX || 1) * 100),
            rotation: Math.round(obj.angle || 0),
            left: Math.round(obj.left || 0),
            top: Math.round(obj.top || 0)
          });
        });
      }

      const areaTranslation = {
        Center: 'وسط الصدر / Centre poitrine',
        ChestLeft: 'صدر يسار / Poitrine Gauche',
        ChestRight: 'صدر يمين / Poitrine Droite',
        Back: 'الظهر / Dos',
        SleeveRight: 'كتف أيمن / Manche Droite',
        SleeveLeft: 'كتف أيسر / Manche Gauche'
      };

      designsList.innerHTML = allDesigns.map((design, idx) => {
        const label = areaTranslation[design.area] || design.area || 'Zone inconnue';
        const fileName = `${design.area || 'design'}_${idx + 1}.png`;
        return `
          <div class="co-summary-design-item">
            <img class="co-summary-design-thumb" src="${design.img}" alt="Design ${idx + 1}" />
            <div class="co-summary-design-meta">
              <strong>${label}</strong>
              <span>حجم: ${design.scale}% | دوران: ${design.rotation}°</span>
              <span>الموقع: ${design.left}px × ${design.top}px</span>
            </div>
            <a class="co-design-download-link" href="${design.img}" download="${fileName}" title="Télécharger le design">⇩</a>
          </div>
        `;
      }).join('');
    }

    // Contact info
    const name = document.getElementById('co-name').value.trim();
    const surname = document.getElementById('co-surname').value.trim();
    document.getElementById('co-sum-customer').textContent = `${name} ${surname}`;
    document.getElementById('co-sum-phone').textContent = document.getElementById('co-phone').value.trim();
    document.getElementById('co-sum-province').textContent = document.getElementById('co-province').value;

    const notes = document.getElementById('co-notes').value.trim();
    document.getElementById('co-sum-notes').textContent = notes || 'Aucune consigne spécifique';
  }

  // ── Custom Order Final Submission ──
  async function submitCustomOrder() {
    try { console.log('[submitCustomOrder] invoked'); } catch(e){}
    const submitBtn = document.getElementById('co-submit');
    if (!submitBtn) {
      console.error('Submit button not found');
      return;
    }

    const form = document.getElementById('co-form');
    if (form && !validateCustomerForm()) {
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Transmission...';

    // Save active area one last time
    try {
      if (typeof saveCurrentArea === 'function') {
        saveCurrentArea();
      }
    } catch (saveErr) {
      console.warn('Unable to save current area before order submission:', saveErr);
    }

    if (!currentProduct) {
      currentProduct = GENERIC_CUSTOM_PRODUCTS[productType] || { id: 0, name: 'Produit personnalisé', price: '0' };
    }

    try {
      // 1. Gather all design layers from all areas
      const layers = [];
      let globalIdx = 0;

      // Validate that areaCanvasData exists
      if (!areaCanvasData || typeof areaCanvasData !== 'object') {
        console.error('areaCanvasData is not properly initialized');
        throw new Error('Canvas data not initialized');
      }

      for (const [area, data] of Object.entries(areaCanvasData)) {
        try { console.log('[submit] scanning area:', area, 'hasData?', !!data && !!data.json && Array.isArray(data.json.objects)); } catch(e){}
        let objects = [];
        
        if (area === currentArea && fabricCanvas) {
          // Retrieve from active canvas to avoid missing unsaved tweaks
          try {
            objects = fabricCanvas.getObjects().filter(o => 
              o.id !== 'printZoneGuide' && 
              o.id !== 'areaLabel' && 
              o.id !== 'garmentBackground' &&
              o.type === 'image' &&
              (o.rawSrc || o.src)
            );
          } catch (fabricErr) {
            console.warn(`Error getting objects from fabric canvas for area ${area}:`, fabricErr);
          }
        } else if (data && data.json && data.json.objects) {
          objects = data.json.objects.filter(o => 
            o.type === 'image' &&
            (o.rawSrc || o.src)
          );
        }

        objects.forEach(obj => {
          try {
            if (!obj) throw new Error('obj is falsy');
            layers.push({
              area: area,
              left: Math.round(obj.left || 0),
              top: Math.round(obj.top || 0),
              angle: Math.round(obj.angle || 0),
              scaleX: parseFloat((obj.scaleX || 1).toFixed(3)),
              scaleY: parseFloat((obj.scaleY || 1).toFixed(3)),
              img: obj.rawSrc || obj.src
            });
          } catch (objErr) {
            console.error('[submit] error processing object in area', area, objErr, obj);
          }
        });
      }

      console.log('[submit] collected layers count =', layers.length, 'sample=', layers.slice(0,5));

      // Check if user uploaded any design
      if (layers.length === 0) {
        alert('يرجى تحميل تصميم واحد على الأقل على المنتج قبل تأكيد الطلب.');
        submitBtn.disabled = false;
        submitBtn.textContent = '✓ Confirmer la commande';
        return;
      }

      // 2. Generate clean mockup image snapshot (hiding guides)
      let mockupSnapshot = '';
      if (fabricCanvas) {
        const currentObjects = fabricCanvas.getObjects().filter(o =>
          o.id !== 'printZoneGuide' &&
          o.id !== 'areaLabel' &&
          o.id !== 'garmentBackground' &&
          o.type === 'image' &&
          (o.rawSrc || o.src)
        );

        let snapshotArea = currentArea;
        if (currentObjects.length === 0) {
          for (const area of Object.keys(areaCanvasData)) {
            if (area === currentArea) continue;
            const areaData = areaCanvasData[area];
            if (areaData && areaData.json && Array.isArray(areaData.json.objects) && areaData.json.objects.some(o => o.type === 'image' && (o.rawSrc || o.src))) {
              snapshotArea = area;
              break;
            }
          }
        }

        try {
          // Add timeout to prevent hanging
          const snapshotPromise = generateOrderMockupSnapshot(snapshotArea);
          const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(''), 8000)); // 8 second timeout
          mockupSnapshot = await Promise.race([snapshotPromise, timeoutPromise]);
        } catch (snapshotErr) {
          console.warn('Unable to generate mockup snapshot:', snapshotErr);
          mockupSnapshot = '';
        }
      }

      // 3. Assemble order payload
      // Safely read form inputs
      const coNameEl = document.getElementById('co-name');
      const coSurnameEl = document.getElementById('co-surname');
      const coEmailEl = document.getElementById('co-email');
      const coPhoneEl = document.getElementById('co-phone');
      const coProvinceEl = document.getElementById('co-province');
      const coNotesEl = document.getElementById('co-notes');

      if (!coNameEl || !coSurnameEl || !coEmailEl || !coPhoneEl || !coProvinceEl) {
        console.error('Missing form elements');
        throw new Error('Form fields not found');
      }

      const name = coNameEl.value.trim();
      const surname = coSurnameEl.value.trim();
      const email = coEmailEl.value.trim();
      const phone = coPhoneEl.value.trim();
      const province = coProvinceEl.value;
      const notes = coNotesEl ? coNotesEl.value.trim() : '';
      
      // Validate form values
      if (!name || !surname || !email || !phone || !province) {
        console.error('Form validation failed: missing values');
        alert('Veuillez remplir tous les champs obligatoires.');
        submitBtn.disabled = false;
        submitBtn.textContent = '✓ Confirmer la commande';
        return;
      }

      const orderId = 'AZ-' + Math.floor(100000 + Math.random() * 900000);
      
      // Safely parse price
      let productPrice = 0;
      try {
        productPrice = parseFloat(String(currentProduct.price).replace(/,/g, '')) || 0;
      } catch (priceErr) {
        console.warn('Unable to parse price:', priceErr);
        productPrice = 0;
      }

      const orderPayload = {
        id: orderId,
        date: new Date().toISOString(),
        items: [{
          id: currentProduct.id || 0,
          name: currentProduct.name || 'Custom Product',
          price: productPrice,
          color: garmentColorName || 'Unknown',
          size: garmentSize || 'M',
          quantity: 1
        }],
        total: productPrice,
        status: 'Pending',
        customer: {
          name: `${name} ${surname}`,
          firstName: name,
          surname: surname,
          fullName: `${name} ${surname}`,
          email: email,
          phone: phone,
          wilaya: province,
          address: province, // required fallback for shipping dashboard
          delivery: 'Tract'
        },
        customOrder: {
          color: garmentColorName || 'Default',
          size: garmentSize || 'M',
          serviceType: productionMethod || 'DTG',
          mockupSnapshot: mockupSnapshot,
          layers: layers,
          customer: {
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            province: province,
            notes: notes
          }
        }
      };

      console.log('Sending custom order payload to backend:', orderPayload);

      // 4. Send POST request
      let synced = false;
      try {
        const apiUrl = (window.API_BASE_URL || '') + '/api/orders';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        if (response.ok) {
          synced = true;
        } else {
          console.warn('Backend server returned an error, saving order locally in localStorage');
        }
      } catch (apiErr) {
        console.warn('Backend server is offline or returned an error, saving order locally in localStorage:', apiErr);
      }

      orderPayload.synced = synced;

      if (!synced) {
        // Save to localStorage local_orders list only if not synced
        // Keep full orderPayload with base64 images so designs are not lost, but clear oldest if quota is exceeded
        let localOrders = [];
        try {
          localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
        } catch (e) {
          console.error('Error parsing local orders:', e);
          try {
            localStorage.removeItem('local_orders');
          } catch (err) {
            console.error('Cannot clear local_orders:', err);
          }
          localOrders = [];
        }

        try {
          localOrders.push(orderPayload);
          localStorage.setItem('local_orders', JSON.stringify(localOrders));
        } catch (storageErr) {
          if (storageErr.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded, removing oldest entries to make space');
            try {
              // Shift out old orders until it fits
              while (localOrders.length > 0) {
                localOrders.shift();
                try {
                  localStorage.setItem('local_orders', JSON.stringify([...localOrders, orderPayload]));
                  break;
                } catch (innerErr) {
                  // continue shifting
                }
              }
            } catch (err) {
              console.error('Cannot save to localStorage even after clearing:', err);
            }
          } else {
            console.error('Error saving to localStorage:', storageErr);
          }
        }
      }

      // Notification configurations
      const NOTIFICATION_CONFIG = {
        telegram: {
          enabled: false,
          botToken: 'YOUR_TELEGRAM_BOT_TOKEN',
          chatId: 'YOUR_TELEGRAM_CHAT_ID'
        },
        emailjs: {
          enabled: false,
          serviceId: 'YOUR_EMAILJS_SERVICE_ID',
          templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
          publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'
        },
        whatsapp: {
          enabled: true,
          phone: '+213655349311',
          apiKey: 'YOUR_CALLMEBOT_API_KEY'
        }
      };

      async function sendTelegramNotification(order) {
        if (!NOTIFICATION_CONFIG.telegram.enabled) return;
        const token = NOTIFICATION_CONFIG.telegram.botToken;
        const chatId = NOTIFICATION_CONFIG.telegram.chatId;
        if (token === 'YOUR_TELEGRAM_BOT_TOKEN' || !token) return;

        const co = order.customOrder || {};
        const itemsText = `- ${order.items[0].name} (اللون: ${co.color}, المقاس: ${co.size}, الخدمة: ${co.serviceType})`;
        const message = `🔔 *طلب مخصص جديد وارد!*\n\n📦 *رقم الطلب:* #${order.id}\n👤 *العميل:* ${order.customer.fullName}\n📞 *الهاتف:* ${order.customer.phone}\n📍 *الولاية:* ${order.customer.wilaya}\n🚚 *التوصيل:* طلب مخصص (Custom Order)\n\n🛒 *المنتجات:*\n${itemsText}\n\n💰 *الإجمالي:* ${order.total.toLocaleString()} DZD`;

        try {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
          });
        } catch (err) {
          console.error('Error sending Telegram notification:', err);
        }
      }

      async function sendEmailJSNotification(order) {
        if (!NOTIFICATION_CONFIG.emailjs.enabled) return;
        const { serviceId, templateId, publicKey } = NOTIFICATION_CONFIG.emailjs;
        if (serviceId === 'YOUR_EMAILJS_SERVICE_ID' || !serviceId) return;

        const co = order.customOrder || {};
        const itemsText = `${order.items[0].name} (Color: ${co.color}, Size: ${co.size}, Service: ${co.serviceType})`;
        const templateParams = {
          order_id: order.id,
          customer_name: order.customer.fullName,
          customer_phone: order.customer.phone,
          customer_wilaya: order.customer.wilaya,
          delivery_type: 'Custom Design Order',
          order_items: itemsText,
          total_price: `${order.total.toLocaleString()} DZD`
        };

        try {
          emailjs.init({ publicKey: publicKey });
          await emailjs.send(serviceId, templateId, templateParams);
        } catch (err) {
          console.error('Error sending EmailJS notification:', err);
        }
      }

      async function sendWhatsAppNotification(order) {
        if (!NOTIFICATION_CONFIG.whatsapp.enabled) return;
        const { phone, apiKey } = NOTIFICATION_CONFIG.whatsapp;
        if (apiKey === 'YOUR_CALLMEBOT_API_KEY' || !apiKey) return;

        const co = order.customOrder || {};
        const itemsText = `1. *${order.items[0].name}* (اللون: ${co.color}, المقاس: ${co.size}, الخدمة: ${co.serviceType}) - السعر: ${order.total.toLocaleString()} DZD`;
        const message = `🔔 *طلب مخصص جديد وارد من الموقع!*\n\n📌 *رقم الطلب:* #${order.id}\n👤 *العميل:* ${order.customer.fullName}\n📞 *الهاتف:* ${order.customer.phone}\n📍 *الولاية:* ${order.customer.wilaya}\n🚚 *التوصيل:* طلب تصميم مخصص\n\n📦 *المنتجات المطلوبة:*\n${itemsText}\n\n💰 *الإجمالي الكلي:* *${order.total.toLocaleString()} DZD*\n\nشكراً!`;
        const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;

        try {
          await fetch(url, { method: 'GET', mode: 'no-cors' });
        } catch (err) {
          console.error('Error sending WhatsApp notification:', err);
        }
      }

      // Show Success Overlay modal Dialog
      const successOverlay = document.getElementById('co-success-overlay');
      if (successOverlay) {
        successOverlay.style.display = 'flex';
        
        let timeLeft = 5;
        const counterEl = document.getElementById('co-redirect-counter');
        if (counterEl) counterEl.textContent = timeLeft;

        const countdownInterval = setInterval(() => {
          timeLeft--;
          if (counterEl) counterEl.textContent = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            window.location.href = window.location.origin + '/';
          }
        }, 1000);

        // Store interval on window so we can clear it if needed
        window.coRedirectInterval = countdownInterval;
      }

      // Send notifications asynchronously
      try { sendTelegramNotification(orderPayload).catch(e=>{}); } catch(e){}
      try { sendEmailJSNotification(orderPayload).catch(e=>{}); } catch(e){}
      try { sendWhatsAppNotification(orderPayload).catch(e=>{}); } catch(e){}

    } catch (err) {
      console.error('Custom order placement error:', err);
      
      // Show more detailed error message
      let errorMsg = 'Une erreur inattendue est survenue.';
      
      if (err.message && err.message.includes('Canvas data')) {
        errorMsg = '❌ Erreur: Données du canevas non initialisées. Veuillez recharger la page.';
      } else if (err.message && err.message.includes('Form fields')) {
        errorMsg = '❌ Erreur: Les champs du formulaire sont manquants. Veuillez recharger la page.';
      } else if (err.message && err.message.includes('design')) {
        errorMsg = '❌ Veuillez télécharger au moins un design avant de confirmer la commande.';
      } else if (err.message && err.message.includes('QuotaExceededError')) {
        errorMsg = '❌ Erreur: Mémoire locale insuffisante. Veuillez vider votre cache navigateur et réessayer.';
      } else if (err.message && err.message.includes('setItem')) {
        errorMsg = '❌ Erreur: Mémoire locale insuffisante. Veuillez vider votre cache navigateur et réessayer.';
      } else if (err.message) {
        errorMsg = '❌ Erreur: ' + err.message;
      }
      
      alert(errorMsg);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '✓ ' + (window.t ? window.t('co_confirm') : 'Confirmer la commande');
    }
  }

})();

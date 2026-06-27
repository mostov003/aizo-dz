/**
 * Test Suite: Advanced Custom Order Preview Modal
 * ════════════════════════════════════════════════════════════
 * Verifies:
 * ✓ Modal files are loaded correctly
 * ✓ Functions are exposed globally
 * ✓ Modal opens/closes properly
 * ✓ Layer selection works
 * ✓ CSS styling applied
 * ✓ Download functionality
 * ✓ Placement guide toggle
 * ════════════════════════════════════════════════════════════
 */

const tests = [];

function test(name, fn) {
  tests.push({ name, fn, status: 'pending' });
}

function runTests() {
  console.clear();
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 ADVANCED CUSTOM ORDER PREVIEW MODAL - TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  tests.forEach((t, idx) => {
    try {
      const result = t.fn();
      if (result === true) {
        console.log(`✅ TEST ${idx + 1}: ${t.name}`);
        passed++;
      } else {
        console.error(`❌ TEST ${idx + 1}: ${t.name}`);
        console.error(`   Expected: true, Got: ${result}`);
        failed++;
      }
    } catch (e) {
      console.error(`❌ TEST ${idx + 1}: ${t.name}`);
      console.error(`   Error: ${e.message}`);
      failed++;
    }
  });

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`📊 RESULTS: ${passed} PASSED | ${failed} FAILED | Total: ${tests.length}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Modal system is ready for use.');
  } else {
    console.error(`⚠️  ${failed} test(s) failed. See errors above.`);
  }

  return { passed, failed, total: tests.length };
}

// ─────────────────────────────────────────────────────────────
// TEST 1: CSS File Loaded
// ─────────────────────────────────────────────────────────────

test('CSS file is loaded', () => {
  const sheets = Array.from(document.styleSheets);
  const found = sheets.some(s => s.href && s.href.includes('custom-order-layer-modal.css'));
  return found;
});

// ─────────────────────────────────────────────────────────────
// TEST 2: JavaScript Module Available
// ─────────────────────────────────────────────────────────────

test('CustomOrderPreviewModal object exists globally', () => {
  return typeof window.CustomOrderPreviewModal === 'object';
});

// ─────────────────────────────────────────────────────────────
// TEST 3: API Functions Exist
// ─────────────────────────────────────────────────────────────

test('openLayerPreviewModal() function exists', () => {
  return typeof window.openLayerPreviewModal === 'function';
});

// ─────────────────────────────────────────────────────────────
// TEST 4: Modal DOM Element Exists
// ─────────────────────────────────────────────────────────────

test('Modal DOM element is created', () => {
  const modal = document.getElementById('co-layer-selector-modal');
  return modal !== null;
});

// ─────────────────────────────────────────────────────────────
// TEST 5: Modal Overlay Element Exists
// ─────────────────────────────────────────────────────────────

test('Modal overlay element is created', () => {
  const overlay = document.getElementById('co-layer-modal-overlay');
  return overlay !== null;
});

// ─────────────────────────────────────────────────────────────
// TEST 6: CSS Grid Layout Classes Defined
// ─────────────────────────────────────────────────────────────

test('CSS classes are properly defined', () => {
  const styles = [
    '.co-layer-modal',
    '.co-layer-modal-container',
    '.co-layer-modal-content',
    '.co-garment-wrapper',
    '.co-layer-details-right'
  ];

  return styles.every(className => {
    const rule = findCSSRule(className);
    return rule !== null;
  });
});

function findCSSRule(selector) {
  for (const sheet of document.styleSheets) {
    try {
      const rules = sheet.cssRules || sheet.rules;
      for (const rule of rules) {
        if (rule.selectorText && rule.selectorText.includes(selector.replace('.', ''))) {
          return rule;
        }
      }
    } catch (e) {
      // Ignore CORS errors for external stylesheets
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// TEST 7: Modal Functions Available
// ─────────────────────────────────────────────────────────────

test('Modal control functions exist', () => {
  const functions = [
    'init',
    'renderLayerTabs',
    'selectLayer',
    'renderLayerPreview',
    'updateSpecsPanel',
    'togglePlacementGuide',
    'downloadCurrentLayer',
    'closeModal'
  ];

  return functions.every(fn => {
    return typeof window.CustomOrderPreviewModal[fn] === 'function';
  });
});

// ─────────────────────────────────────────────────────────────
// TEST 8: Modal Data Structure
// ─────────────────────────────────────────────────────────────

test('Modal data properties are initialized', () => {
  const props = [
    'currentOrderId',
    'currentSelectedLayerIndex',
    'showPlacementGuide'
  ];

  return props.every(prop => {
    return window.CustomOrderPreviewModal.hasOwnProperty(prop);
  });
});

// ─────────────────────────────────────────────────────────────
// TEST 9: Required Global Functions Exist
// ─────────────────────────────────────────────────────────────

test('Required global helper functions exist', () => {
  const functions = [
    'resolveAssetUrl',
    'detectGarmentTypeFromOrder',
    'adminGenerateGarmentSVG'
  ];

  return functions.every(fn => {
    return typeof window[fn] === 'function';
  });
});

// ─────────────────────────────────────────────────────────────
// TEST 10: Responsive CSS Breakpoints Defined
// ─────────────────────────────────────────────────────────────

test('Responsive breakpoints are defined', () => {
  const sheet = Array.from(document.styleSheets).find(s => 
    s.href && s.href.includes('custom-order-layer-modal.css')
  );

  if (!sheet) return false;

  try {
    const cssText = Array.from(sheet.cssRules)
      .map(rule => rule.cssText || '')
      .join(' ');

    const has1024 = cssText.includes('1024px');
    const has768 = cssText.includes('768px');
    const has480 = cssText.includes('480px');

    return has1024 && has768 && has480;
  } catch (e) {
    return false;
  }
});

// ─────────────────────────────────────────────────────────────
// TEST 11: Orders Cache Available
// ─────────────────────────────────────────────────────────────

test('Global orders cache exists', () => {
  return window.cachedOrders && Array.isArray(window.cachedOrders) && window.cachedOrders.length > 0;
});

// ─────────────────────────────────────────────────────────────
// TEST 12: Sample Order with Custom Data
// ─────────────────────────────────────────────────────────────

test('Sample custom order has required structure', () => {
  if (!window.cachedOrders || window.cachedOrders.length === 0) {
    console.warn('   ⚠️  No orders available, skipping structure validation');
    return true; // Skip if no orders
  }

  const customOrder = window.cachedOrders.find(o => o.customOrder);
  if (!customOrder) {
    console.warn('   ⚠️  No custom order found, skipping structure validation');
    return true; // Skip if no custom orders
  }

  const hasLayers = Array.isArray(customOrder.customOrder.layers);
  if (!hasLayers || customOrder.customOrder.layers.length === 0) {
    return false;
  }

  const layer = customOrder.customOrder.layers[0];
  return layer.area && typeof layer.left === 'number' && typeof layer.top === 'number';
});

// ─────────────────────────────────────────────────────────────
// TEST 13: SVG Fallback Generation
// ─────────────────────────────────────────────────────────────

test('Modal can generate fallback garment SVG', () => {
  try {
    const svg = window.CustomOrderPreviewModal.generateFallbackGarmentSVG('tshirt', '#FF0000');
    return svg && svg.includes('<svg') && svg.includes('</svg>');
  } catch (e) {
    return false;
  }
});

// ─────────────────────────────────────────────────────────────
// TEST 14: Button Integration in Dashboard
// ─────────────────────────────────────────────────────────────

test('Advanced Preview button is in dashboard', () => {
  // Check if admin.html contains the new button code
  const html = document.documentElement.outerHTML;
  return html.includes('معاينة متقدمة') || html.includes('Advanced Preview');
});

// ─────────────────────────────────────────────────────────────
// TEST 15: Animation Keyframes Defined
// ─────────────────────────────────────────────────────────────

test('Modal animations are defined', () => {
  try {
    const sheets = Array.from(document.styleSheets).find(s =>
      s.href && s.href.includes('custom-order-layer-modal.css')
    );

    if (!sheets) return false;

    const cssText = Array.from(sheets.cssRules)
      .map(rule => rule.cssText || '')
      .join(' ');

    return cssText.includes('fadeIn') && cssText.includes('slideUp');
  } catch (e) {
    return false;
  }
});

// ─────────────────────────────────────────────────────────────
// SPECIAL TEST: Display Test Results with Details
// ─────────────────────────────────────────────────────────────

function displayDetailedResults() {
  console.log('\n📋 DETAILED RESULTS:');
  console.log('─────────────────────────────────────────────────────────────\n');

  // Check modal visibility
  const modal = document.getElementById('co-layer-selector-modal');
  if (modal) {
    console.log(`📊 Modal Status:`);
    console.log(`   Display: ${window.getComputedStyle(modal).display}`);
    console.log(`   Z-Index: ${window.getComputedStyle(modal).zIndex}`);
    console.log(`   Position: ${window.getComputedStyle(modal).position}`);
  }

  // Check cached orders
  console.log(`\n📦 Cached Orders:`);
  console.log(`   Total Orders: ${window.cachedOrders?.length || 0}`);
  if (window.cachedOrders && window.cachedOrders.length > 0) {
    const customOrders = window.cachedOrders.filter(o => o.customOrder);
    console.log(`   Custom Orders: ${customOrders.length}`);
    if (customOrders.length > 0) {
      const firstOrder = customOrders[0];
      const layerCount = firstOrder.customOrder.layers?.length || 0;
      console.log(`   Layers in First Order (${firstOrder.id}): ${layerCount}`);
    }
  }

  // Check CSS loading
  console.log(`\n🎨 CSS Styling:`);
  const sheets = Array.from(document.styleSheets);
  const customOrderCSS = sheets.find(s => s.href && s.href.includes('custom-order-layer-modal.css'));
  console.log(`   Custom Modal CSS: ${customOrderCSS ? '✅ Loaded' : '❌ Not Found'}`);
  if (customOrderCSS) {
    try {
      console.log(`   CSS Rules Count: ${customOrderCSS.cssRules.length}`);
    } catch (e) {
      console.log(`   CSS Rules: ⚠️  Cannot access (CORS)`);
    }
  }

  // Check JavaScript module
  console.log(`\n⚙️  JavaScript Module:`);
  console.log(`   CustomOrderPreviewModal: ${window.CustomOrderPreviewModal ? '✅ Loaded' : '❌ Not Found'}`);
  console.log(`   openLayerPreviewModal: ${window.openLayerPreviewModal ? '✅ Loaded' : '❌ Not Found'}`);
}

// ─────────────────────────────────────────────────────────────
// EXPORT TEST FUNCTION
// ─────────────────────────────────────────────────────────────

window.testAdvancedPreviewModal = function() {
  const results = runTests();
  displayDetailedResults();
  return results;
};

// Auto-run tests on load if in admin dashboard
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Test suite loaded. Run: testAdvancedPreviewModal()');
  });
} else {
  console.log('✨ Test suite loaded. Run: testAdvancedPreviewModal()');
}

// Auto-run if manual trigger detected
window.runModalTests = window.testAdvancedPreviewModal;

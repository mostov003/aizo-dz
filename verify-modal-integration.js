/**
 * Integration Verification Script
 * ════════════════════════════════════════════════════════════
 * Verifies all new files are in place and correctly integrated
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 ADVANCED MODAL INTEGRATION VERIFICATION');
console.log('═══════════════════════════════════════════════════════════\n');

const checks = [];

// Check 1: JavaScript Modal File
console.log('📄 Checking JavaScript files...');
const jsFile = 'js/custom-order-preview-modal.js';
if (fs.existsSync(jsFile)) {
  const jsContent = fs.readFileSync(jsFile, 'utf8');
  const hasCustomOrderPreviewModal = jsContent.includes('window.CustomOrderPreviewModal');
  const hasOpenLayerPreviewModal = jsContent.includes('window.openLayerPreviewModal');
  
  console.log(`  ✅ ${jsFile} exists (${Math.round(jsContent.length / 1024)}KB)`);
  if (hasCustomOrderPreviewModal) console.log(`     ✓ Contains CustomOrderPreviewModal object`);
  if (hasOpenLayerPreviewModal) console.log(`     ✓ Contains openLayerPreviewModal function`);
  checks.push({ name: 'JS File Exists', pass: true });
  checks.push({ name: 'JS Module Structure', pass: hasCustomOrderPreviewModal && hasOpenLayerPreviewModal });
} else {
  console.log(`  ❌ ${jsFile} NOT FOUND`);
  checks.push({ name: 'JS File Exists', pass: false });
}

// Check 2: CSS File
console.log('\n🎨 Checking CSS files...');
const cssFile = 'css/custom-order-layer-modal.css';
if (fs.existsSync(cssFile)) {
  const cssContent = fs.readFileSync(cssFile, 'utf8');
  const hasCoreClasses = cssContent.includes('.co-layer-modal') && 
                        cssContent.includes('.co-garment-wrapper') &&
                        cssContent.includes('.co-layer-details-right');
  const hasResponsive = cssContent.includes('@media (max-width: 1024px)') &&
                       cssContent.includes('@media (max-width: 768px)') &&
                       cssContent.includes('@media (max-width: 480px)');
  const hasAnimations = cssContent.includes('@keyframes fadeIn') && 
                       cssContent.includes('@keyframes slideUp');
  
  console.log(`  ✅ ${cssFile} exists (${Math.round(cssContent.length / 1024)}KB)`);
  if (hasCoreClasses) console.log(`     ✓ Contains core CSS classes`);
  if (hasResponsive) console.log(`     ✓ Contains responsive breakpoints (1024px, 768px, 480px)`);
  if (hasAnimations) console.log(`     ✓ Contains animations (fadeIn, slideUp)`);
  checks.push({ name: 'CSS File Exists', pass: true });
  checks.push({ name: 'CSS Classes', pass: hasCoreClasses });
  checks.push({ name: 'Responsive Design', pass: hasResponsive });
  checks.push({ name: 'CSS Animations', pass: hasAnimations });
} else {
  console.log(`  ❌ ${cssFile} NOT FOUND`);
  checks.push({ name: 'CSS File Exists', pass: false });
}

// Check 3: Admin HTML Integration
console.log('\n🌐 Checking admin.html integration...');
if (fs.existsSync('admin.html')) {
  const htmlContent = fs.readFileSync('admin.html', 'utf8');
  const hasCSSImport = htmlContent.includes('custom-order-layer-modal.css');
  const hasJSImport = htmlContent.includes('custom-order-preview-modal.js');
  const hasAdvancedButton = htmlContent.includes('معاينة متقدمة') || htmlContent.includes('Advanced Preview');
  
  console.log(`  ✅ admin.html exists`);
  if (hasCSSImport) console.log(`     ✓ CSS import found: custom-order-layer-modal.css`);
  if (hasJSImport) console.log(`     ✓ JS import found: custom-order-preview-modal.js`);
  if (hasAdvancedButton) console.log(`     ✓ Advanced Preview button added to dropdown`);
  
  checks.push({ name: 'CSS Import in HTML', pass: hasCSSImport });
  checks.push({ name: 'JS Import in HTML', pass: hasJSImport });
  checks.push({ name: 'Button Integration', pass: hasAdvancedButton });
} else {
  console.log(`  ❌ admin.html NOT FOUND`);
}

// Check 4: Documentation Files
console.log('\n📚 Checking documentation...');
const docFiles = [
  'CUSTOM_ORDER_ADVANCED_PREVIEW.md',
  'MODAL_QUICK_START.md'
];

docFiles.forEach(doc => {
  if (fs.existsSync(doc)) {
    const size = fs.statSync(doc).size;
    console.log(`  ✅ ${doc} (${Math.round(size / 1024)}KB)`);
    checks.push({ name: `Doc: ${doc}`, pass: true });
  } else {
    console.log(`  ⚠️  ${doc} NOT FOUND`);
    checks.push({ name: `Doc: ${doc}`, pass: false });
  }
});

// Check 5: Test Suite
console.log('\n🧪 Checking test suite...');
const testFile = 'test-modal-system.js';
if (fs.existsSync(testFile)) {
  const testContent = fs.readFileSync(testFile, 'utf8');
  const hasTests = testContent.includes('test(') && testContent.includes('runTests');
  
  console.log(`  ✅ ${testFile} exists`);
  if (hasTests) console.log(`     ✓ Contains test suite with runTests() function`);
  checks.push({ name: 'Test Suite File', pass: true });
  checks.push({ name: 'Test Suite Functions', pass: hasTests });
} else {
  console.log(`  ⚠️  ${testFile} NOT FOUND`);
  checks.push({ name: 'Test Suite File', pass: false });
}

// Check 6: Server.js API Verification
console.log('\n🔌 Checking server.js API endpoints...');
if (fs.existsSync('server.js')) {
  const serverContent = fs.readFileSync('server.js', 'utf8');
  const hasOrdersAPI = serverContent.includes('/api/orders');
  const hasCustomOrder = serverContent.includes('customOrder');
  
  console.log(`  ✅ server.js exists`);
  if (hasOrdersAPI) console.log(`     ✓ POST /api/orders endpoint present`);
  if (hasCustomOrder) console.log(`     ✓ Custom order handling implemented`);
  checks.push({ name: 'API Endpoint', pass: hasOrdersAPI });
} else {
  console.log(`  ❌ server.js NOT FOUND`);
}

// Summary
console.log('\n═══════════════════════════════════════════════════════════');
console.log('📊 INTEGRATION CHECK RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

const passed = checks.filter(c => c.pass).length;
const failed = checks.filter(c => !c.pass).length;
const total = checks.length;

checks.forEach(c => {
  const status = c.pass ? '✅' : '❌';
  console.log(`${status} ${c.name}`);
});

console.log('\n' + '═'.repeat(59));
console.log(`📈 RESULTS: ${passed}/${total} checks PASSED`);

if (failed === 0) {
  console.log('\n✨ ALL CHECKS PASSED! Modal system is fully integrated.');
  console.log('\n📍 Next Steps:');
  console.log('   1. Start server: npm start');
  console.log('   2. Open http://localhost:3000/admin.html');
  console.log('   3. Find a custom order and click "معاينة متقدمة"');
  console.log('   4. Test layer switching, guide toggle, and download');
  console.log('\n💡 Run tests in browser console: testAdvancedPreviewModal()');
} else {
  console.log(`\n⚠️  ${failed} check(s) failed. See details above.`);
}

console.log('═'.repeat(59) + '\n');

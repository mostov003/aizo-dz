const fs = require('fs');
try {
  const code = fs.readFileSync('js/customize.js', 'utf8');
  // Simple check using Function constructor to parse code as JS (wrapped in a block)
  new Function('const window = {}; const document = {}; const fabric = {}; ' + code);
  console.log('✅ syntax check passed for js/customize.js');
} catch (err) {
  // If function constructor fails due to syntax error, it will throw
  if (err instanceof SyntaxError) {
    console.error('❌ Syntax Error in js/customize.js:', err.message);
  } else {
    // ReferenceError is expected since we mock minimal globals, but SyntaxError is not
    console.log('✅ syntax check passed (ReferenceErrors are expected but no SyntaxErrors):', err.message);
  }
}

const fs = require('fs');
const path = require('path');

// Create a simple test image (1x1 PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const buffer = Buffer.from(testImageBase64, 'base64');
const filePath = path.join(__dirname, 'test-image.png');

fs.writeFileSync(filePath, buffer);
console.log('✅ Test image created:', filePath);

// Now let's create an HTML file to upload this image via Playwright
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Upload</title>
</head>
<body>
  <form id="testForm">
    <input type="file" id="fileInput" accept="image/*" />
    <button type="submit">Upload</button>
  </form>
  <script>
    document.getElementById('testForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = document.getElementById('fileInput').files[0];
      if (!file) {
        alert('Please select a file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        console.log('File loaded as base64, length:', base64.length);
        // Now we can use this base64 in our test
        window.testImageBase64 = base64;
        alert('File ready for testing');
      };
      reader.readAsDataURL(file);
    });
  </script>
</body>
</html>
`;

const htmlPath = path.join(__dirname, 'test-upload.html');
fs.writeFileSync(htmlPath, htmlContent);
console.log('✅ Test upload HTML created:', htmlPath);

// Display image info
console.log('\n📊 Image Info:');
console.log('- Size:', buffer.length, 'bytes');
console.log('- Type: PNG (1x1 pixel)');
console.log('- Path:', filePath);

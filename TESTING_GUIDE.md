# 🧪 Manual Testing Guide - Custom Order Confirmation

## Prerequisites (المتطلبات المسبقة)

✅ Server running on http://localhost:3000
✅ Browser open to http://localhost:3000/customize.html
✅ User account setup (optional)

---

## Step-by-Step Testing (الاختبار خطوة بخطوة)

### Step 1: Access Custom Order Page
1. Open browser to `http://localhost:3000/customize.html`
2. You should see the custom order customization interface
3. Verify the fabric.js canvas is loaded

### Step 2: Select Product & Color
1. Choose a product type from the dropdown (e.g., T-Shirt)
2. Select a color (e.g., Navy Blue, White, Black)
3. Click "Next" or navigate to Step 2

### Step 3: Upload Design
1. Click on a design area (Front, Back, etc.)
2. Click "🖼️ Upload Design" button
3. Select or drag an image file
4. Position the design on the canvas using Fabric.js controls
5. Scale and rotate as needed
6. Click "Next" or navigate to Step 3

### Step 4: Fill Customer Information
1. **Full Name**: Enter your name
2. **Email**: Enter valid email
3. **Phone**: Enter phone number (e.g., +213655349311)
4. **Wilaya**: Select from dropdown (e.g., Alger)
5. **Delivery Notes**: Add any special instructions (optional)
6. Verify all fields are filled

### Step 5: Submit Order
1. Click **"✓ Confirmer la commande"** button (or equivalent based on language)
2. Form validation should pass (all required fields filled)
3. Button should become disabled with "⏳ Transmission..." text

### Step 6: Verify Success Overlay
1. **Success message should appear** with:
   - ✓ Checkmark icon
   - "Commande envoyée avec succès !" message
   - "Nous avons bien reçu votre commande personnalisée..." description
   - "Retour aux achats / Fermer" button

2. **At this point**, you have TWO options:
   - **Wait 3 seconds**: Page auto-redirects to admin.html#orders
   - **Click button**: Close overlay and manually redirect

### Step 7: Verify Dashboard Order
1. You should be redirected to `admin.html#orders`
2. Look for your order in the orders table
3. Verify the order shows:
   - ✅ Order ID (e.g., AZ-697973)
   - ✅ Customer name
   - ✅ Status badge (e.g., "en attente / Pending")
   - ✅ **"🎨 Custom" badge** (custom order indicator)

### Step 8: View Custom Order Details
1. In the orders table, click on your order row or actions menu
2. Click **"🎨 عرض التصميم / View Mockup"** button
3. Custom order modal should open showing:
   - 📷 Mockup image for each design area
   - 🎯 Design layer positions
   - 📐 Coordinates and scale information
   - 🔘 Action buttons (view, download, etc.)

---

## Expected Behavior (السلوك المتوقع)

### ✅ Correct Flow
```
Fill Form ➜ Click Submit ➜ Success Overlay ➜ Auto-Redirect (3s) ➜ Dashboard Shows Order ✓
```

### ❌ Previous Broken Flow
```
Fill Form ➜ Click Submit ➜ Success Overlay ➜ Redirect to Collections (WRONG!) ❌
```

---

## Verification Points (نقاط التحقق)

### Frontend Validation
- [ ] Form requires all fields (name, email, phone, wilaya)
- [ ] Submit button shows loading state "⏳ Transmission..."
- [ ] Success overlay appears after submission
- [ ] Close button on overlay works
- [ ] Auto-redirect happens after 3 seconds

### Backend Validation
- [ ] Order saved to `/db/orders.json`
- [ ] Order ID generated correctly (AZ-XXXXXX)
- [ ] Images saved to `/uploads/` folder
- [ ] Mockup image saved
- [ ] Design layers saved with metadata

### Dashboard Validation
- [ ] Order appears in orders table
- [ ] Custom order shows "🎨 Custom" badge
- [ ] Click on order row shows full details
- [ ] Custom order modal displays images
- [ ] Action buttons work (accept, reject, ship, etc.)

---

## Common Issues & Solutions (المشاكل الشائعة و الحلول)

### Issue 1: Form Won't Submit
**Symptoms**: Submit button disabled or grayed out
**Solutions**:
1. Verify all required fields are filled
2. Check console for validation errors (F12 → Console)
3. Ensure at least one design is uploaded

### Issue 2: Page Redirects to Collections
**Symptoms**: Clicking button goes to collections.html
**Solutions**:
1. Refresh page and clear browser cache (Ctrl+Shift+Delete)
2. Verify `js/customize.js` has latest fixes
3. Check browser console for JavaScript errors

### Issue 3: Order Not Appearing in Dashboard
**Symptoms**: Redirected to dashboard but order not visible
**Solutions**:
1. Refresh dashboard page (F5)
2. Check browser localStorage (F12 → Application → localStorage)
3. Verify server is running and API working

### Issue 4: Custom Order Modal Won't Open
**Symptoms**: Clicking view details shows no modal
**Solutions**:
1. Check if order has `customOrder` field (check JSON)
2. Verify images uploaded correctly (check `/uploads/` folder)
3. Check browser console for JavaScript errors

### Issue 5: Images Not Showing in Details
**Symptoms**: Modal opens but images appear broken
**Solutions**:
1. Verify images exist in `/uploads/` folder
2. Check file paths in order JSON (should be `/uploads/design-*.png`)
3. Verify web server can serve uploaded files

---

## Browser Console Monitoring (مراقبة وحدة التحكم)

Press **F12** to open Developer Tools and check Console tab:

### Expected Log Messages
```javascript
// When form validates
✓ Form validation passed

// When order submits
→ Sending custom order payload to backend:
  {id: "AZ-697973", ...}

// When server responds
✓ Order saved successfully
📦 Order ID: AZ-697973

// Before redirect
→ Redirecting to admin.html#orders in 3 seconds...
```

### Error Messages to Watch For
```javascript
❌ "Form validation failed"
❌ "Unable to save current area before order submission"
❌ "Custom order placement error"
❌ "Unexpected error occurred"
```

---

## Network Traffic Monitoring (مراقبة حركة الشبكة)

Press **F12** → **Network** tab:

1. Submit order
2. Look for **POST** request to `/api/orders`
3. Verify response status is **201 Created**
4. Check response body contains order details

### Successful Response Example
```json
HTTP 201 Created
{
  "id": "AZ-697973",
  "status": "Pending",
  "customOrder": {
    "mockupSnapshot": "/uploads/mockup-AZ-697973.png",
    "layers": [{...}]
  }
}
```

---

## Mobile Testing (الاختبار على الجوال)

### Responsive Design
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Test on different screen sizes:
   - [ ] iPhone 12 (390×844)
   - [ ] iPad (768×1024)
   - [ ] Desktop (1920×1080)

### Touch Testing
1. Try dragging designs on mobile
2. Verify buttons are clickable
3. Check form fields are accessible
4. Test success overlay on small screens

---

## Performance Metrics (مقاييس الأداء)

### Timing
- Form submission: < 1 second
- Server response: < 2 seconds
- Image upload/saving: < 3 seconds
- Auto-redirect: 3 seconds
- **Total flow**: < 6 seconds

### File Sizes
- Design image: Typically 100KB - 2MB
- Mockup snapshot: Typically 50KB - 500KB
- Order payload: < 1MB

---

## Cleanup After Testing (التنظيف بعد الاختبار)

### Remove Test Orders
```javascript
// In browser console on admin.html
localStorage.removeItem('local_orders');
// Or delete from db/orders.json manually
```

### Clear Uploaded Files
```bash
# On server terminal
rm -rf uploads/design-AZ-*.png uploads/mockup-AZ-*.png
# Or on Windows
rmdir /S /Q uploads\design-AZ-*
```

### View Order in Database
```bash
# Check if order was saved
cat db/orders.json | grep "AZ-697973"
```

---

## Test Case Matrix (مصفوفة حالات الاختبار)

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Basic submission | Fill form, submit | Order saved, redirect to dashboard | ✅ |
| Auto-redirect | Submit, wait 3s | Auto-redirect to admin.html#orders | ✅ |
| Manual close | Submit, click button | Overlay closes, redirect to dashboard | ✅ |
| View details | Click custom badge | Modal shows designs and mockup | ✅ |
| Offline saving | Submit without server | Order saved to localStorage | ✅ |
| Missing fields | Leave field empty, submit | Form validation error message | ✅ |
| No designs | Submit without upload | Alert "Please upload at least one design" | ✅ |
| Mobile viewport | Test on 390×844 | All elements visible and clickable | ✅ |
| Multiple designs | Upload 2-3 designs | All designs appear in mockup | ✅ |

---

## Success Criteria (معايير النجاح)

The fix is considered **SUCCESSFUL** when:

✅ Custom order form submits without errors
✅ Success overlay displays with checkmark icon
✅ Page automatically redirects to `admin.html#orders` after 3 seconds
✅ OR user can click button to manually redirect
✅ Order appears in orders table with "🎨 Custom" badge
✅ Custom order details modal shows all designs and mockup
✅ Order can be managed (accepted, rejected, shipped)
✅ All action buttons work correctly
✅ No console errors appear

---

## Summary (الملخص)

This testing guide verifies that the custom order confirmation flow works end-to-end:
1. ✅ Form submission
2. ✅ Backend processing
3. ✅ Success feedback
4. ✅ Dashboard navigation
5. ✅ Order visibility & management

**Estimated Testing Time**: 5-10 minutes per test case

/**
 * Fix French accented status values in admin.html
 * Replace confirmé, annulé, livré, retourné with English equivalents
 */
const fs = require('fs');

const file = 'admin.html';
let content = fs.readFileSync(file, 'utf8');

const originalLength = content.length;

// ═══════════════════════════════════════════════
// 1. Fix onclick handlers - status values passed to changeOrderStatus
// ═══════════════════════════════════════════════
content = content.replace(/'\\'confirmé\\''/g, "'Confirmed'");
content = content.replace(/'\\'annulé\\''/g, "'Cancelled'");
content = content.replace(/'\\'livré\\''/g, "'Delivered'");
content = content.replace(/'\\'retourné\\''/g, "'Returned'");

// Also fix in the onclick attribute strings
content = content.replace(/\\'confirmé\\'/g, "\\'Confirmed\\'");
content = content.replace(/\\'annulé\\'/g, "\\'Cancelled\\'");
content = content.replace(/\\'livré\\'/g, "\\'Delivered\\'");
content = content.replace(/\\'retourné\\'/g, "\\'Returned\\'");

// ═══════════════════════════════════════════════
// 2. Fix status comparisons in if/else conditions
// ═══════════════════════════════════════════════
content = content.replace(/order\.status === 'confirmé'/g, "order.status === 'Confirmed'");
content = content.replace(/order\.status === 'annulé'/g, "order.status === 'Cancelled'");
content = content.replace(/order\.status === 'livré'/g, "order.status === 'Delivered'");
content = content.replace(/order\.status === 'retourné'/g, "order.status === 'Returned'");
content = content.replace(/order\.status === 'en attente'/g, "order.status === 'Pending'");

// ═══════════════════════════════════════════════
// 3. Fix status filter comparisons  
// ═══════════════════════════════════════════════
// In the filter logic that checks multiple statuses
content = content.replace(/o\.status === 'confirmé'/g, "o.status === 'Confirmed'");
content = content.replace(/o\.status === 'annulé'/g, "o.status === 'Cancelled'");
content = content.replace(/o\.status === 'livré'/g, "o.status === 'Delivered'");
content = content.replace(/o\.status === 'retourné'/g, "o.status === 'Returned'");

// ═══════════════════════════════════════════════
// 4. Fix the statusMap display labels
// ═══════════════════════════════════════════════
content = content.replace(/'confirmé': 'مؤكد'/g, "'Confirmed': 'مؤكد'");
content = content.replace(/'livré': 'تم التسليم'/g, "'Delivered': 'تم التسليم'");
content = content.replace(/'retourné': 'مُرجع'/g, "'Returned': 'مُرجع'");
content = content.replace(/'annulé': 'ملغى'/g, "'Cancelled': 'ملغى'");

// ═══════════════════════════════════════════════
// 5. Fix classMap entries
// ═══════════════════════════════════════════════
content = content.replace(/'confirmé': 'status-confirmed'/g, "'Confirmed': 'status-confirmed'");
content = content.replace(/'livré': 'status-delivered'/g, "'Delivered': 'status-delivered'");
content = content.replace(/'retourné': 'status-returned'/g, "'Returned': 'status-returned'");
content = content.replace(/'annulé': 'status-cancelled'/g, "'Cancelled': 'status-cancelled'");

// ═══════════════════════════════════════════════
// 6. Fix the shipOrderViaZR function - wrong status assignment
// ═══════════════════════════════════════════════
// "livrǸ" is corrupted 'livré' - fix to 'Delivered'
content = content.replace(/order\.status = 'livrǸ'/g, "order.status = 'Delivered'");
content = content.replace(/order\.status = 'livré'/g, "order.status = 'Delivered'");
content = content.replace(/order\.status = 'confirmé'/g, "order.status = 'Confirmed'");
content = content.replace(/order\.status = 'annulé'/g, "order.status = 'Cancelled'");
content = content.replace(/order\.status = 'retourné'/g, "order.status = 'Returned'");

// ═══════════════════════════════════════════════
// 7. Fix the !== 'annulé' checks
// ═══════════════════════════════════════════════
content = content.replace(/order\.status !== 'annulé'/g, "order.status !== 'Cancelled'");
content = content.replace(/o\.status !== 'annulé'/g, "o.status !== 'Cancelled'");

// ═══════════════════════════════════════════════
// 8. Fix the final states check in dropdown
// ═══════════════════════════════════════════════
// The "Final states" check: else if (order.status === 'livré' || order.status === 'retourné' || order.status === 'annulé')
// → Already handled above since we replaced individual comparisons

// ═══════════════════════════════════════════════
// 9. Fix the 'Pending' filter to also include 'en attente'
// ═══════════════════════════════════════════════
// Update the Pending filter button to also match 'en attente' orders
// Already handled by the comparisons replacement above

// ═══════════════════════════════════════════════
// Also fix any corrupted French characters (ǸÉ, etc.)
// ═══════════════════════════════════════════════
// Fix corrupted versions of French status
content = content.replace(/o\.status === 'confirmǸ'/g, "o.status === 'Confirmed'");
content = content.replace(/order\.status === 'confirmǸ'/g, "order.status === 'Confirmed'");

console.log('Original length:', originalLength);
console.log('New length:', content.length);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Fixed status encoding in admin.html');

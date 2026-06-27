/* ════════════════════════════════════════════
   aizo.dz — sync.js
   Offline Storage Synchronization Module
   ════════════════════════════════════════════ */

(function() {
  async function syncPendingOrders() {
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
    } catch (e) {
      console.error('Error parsing local_orders for sync:', e);
      return;
    }

    const pendingOrders = localOrders.filter(o => !o.synced);
    if (pendingOrders.length === 0) return;

    console.log(`🔄 Found ${pendingOrders.length} pending orders to sync...`);
    const remainingOrders = [...localOrders];

    for (const order of pendingOrders) {
      try {
        const apiUrl = (window.API_BASE_URL || '') + '/api/orders';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
        if (res.ok) {
          console.log(`✅ Order ${order.id} synced successfully.`);
          // Remove from local storage array or mark as synced
          const idx = remainingOrders.findIndex(o => o.id === order.id);
          if (idx > -1) {
            remainingOrders.splice(idx, 1);
          }
        }
      } catch (err) {
        console.warn(`⚠️ Failed to sync order ${order.id}:`, err.message);
      }
    }

    localStorage.setItem('local_orders', JSON.stringify(remainingOrders));
    
    // Dispatch a custom event to notify dashboard if open
    window.dispatchEvent(new CustomEvent('orders-synced'));
  }

  async function syncPendingLeads() {
    let localLeads = [];
    try {
      localLeads = JSON.parse(localStorage.getItem('local_leads') || '[]');
    } catch (e) {
      console.error('Error parsing local_leads for sync:', e);
      return;
    }

    if (localLeads.length === 0) return;

    console.log(`🔄 Found ${localLeads.length} pending leads to sync...`);
    const remainingLeads = [...localLeads];

    for (const lead of localLeads) {
      try {
        const apiUrl = (window.API_BASE_URL || '') + '/api/leads';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead)
        });
        if (res.ok) {
          console.log(`✅ Lead ${lead.email} synced successfully.`);
          const idx = remainingLeads.findIndex(l => l.email === lead.email);
          if (idx > -1) {
            remainingLeads.splice(idx, 1);
          }
        }
      } catch (err) {
        console.warn(`⚠️ Failed to sync lead ${lead.email}:`, err.message);
      }
    }

    localStorage.setItem('local_leads', JSON.stringify(remainingLeads));
  }

  // Export functions to global scope
  window.syncPendingOrders = syncPendingOrders;
  window.syncPendingLeads = syncPendingLeads;

  // Run sync on load (delay slightly to let page initialize)
  window.addEventListener('load', () => {
    setTimeout(() => {
      syncPendingOrders();
      syncPendingLeads();
    }, 1000);
  });

  // Run sync when coming online
  window.addEventListener('online', () => {
    console.log('🌐 Browser went online. Syncing pending data...');
    syncPendingOrders();
    syncPendingLeads();
  });
})();

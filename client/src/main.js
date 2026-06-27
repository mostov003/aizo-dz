import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './assets/style.css'

// Intercept all fetch calls to inject the configured production API Base URL if defined
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === 'string' && (input.startsWith('/api/') || input.startsWith('/uploads/'))) {
    const apiBaseUrl = window.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';
    if (apiBaseUrl) {
      const base = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
      input = `${base}${input}`;
    }
  }
  return originalFetch.call(this, input, init);
};

// Sync pending orders and leads from localStorage to server
async function syncPendingOrders() {
  let localOrders = [];
  try {
    localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
  } catch (e) {
    return;
  }

  const pendingOrders = localOrders.filter(o => !o.synced);
  if (pendingOrders.length === 0) return;

  console.log(`[aizo.dz] Syncing ${pendingOrders.length} pending orders...`);
  const remainingOrders = [...localOrders];
  const apiBaseUrl = window.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';

  for (const order of pendingOrders) {
    try {
      const res = await originalFetch(`${apiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (res.ok) {
        console.log(`[aizo.dz] Synced order: ${order.id}`);
        const idx = remainingOrders.findIndex(o => o.id === order.id);
        if (idx > -1) {
          remainingOrders[idx].synced = true;
        }
      }
    } catch (err) {
      console.warn(`[aizo.dz] Failed to sync order ${order.id}:`, err.message);
    }
  }

  localStorage.setItem('local_orders', JSON.stringify(remainingOrders));
}

async function syncPendingLeads() {
  let localLeads = [];
  try {
    localLeads = JSON.parse(localStorage.getItem('local_leads') || '[]');
  } catch (e) {
    return;
  }

  if (localLeads.length === 0) return;

  console.log(`[aizo.dz] Syncing ${localLeads.length} pending leads...`);
  const remainingLeads = [...localLeads];
  const apiBaseUrl = window.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';

  for (const lead of localLeads) {
    try {
      const res = await originalFetch(`${apiBaseUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      if (res.ok) {
        console.log(`[aizo.dz] Synced lead: ${lead.email}`);
        const idx = remainingLeads.findIndex(l => l.email === lead.email);
        if (idx > -1) {
          remainingLeads.splice(idx, 1);
        }
      }
    } catch (err) {
      console.warn(`[aizo.dz] Failed to sync lead ${lead.email}:`, err.message);
    }
  }

  localStorage.setItem('local_leads', JSON.stringify(remainingLeads));
}

// Run sync on load and when connection goes online
window.addEventListener('load', () => {
  setTimeout(() => {
    syncPendingOrders();
    syncPendingLeads();
  }, 1500);
});

window.addEventListener('online', () => {
  syncPendingOrders();
  syncPendingLeads();
});


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')


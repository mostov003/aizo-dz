/* ════════════════════════════════════════════
   aizo.dz — config.js
   Centralized API URL Configuration
   ════════════════════════════════════════════
   
   ⚡ HOW THIS WORKS:
   - In production (Railway/Render): API_BASE_URL auto-resolves to the deployed URL
   - On local network: API_BASE_URL auto-resolves to the local server address
   - This file is the SINGLE SOURCE OF TRUTH for the backend URL
   
   ⚙️ TO SET YOUR PRODUCTION URL after deployment:
   Change PRODUCTION_URL below to your Railway/Render deployment URL.
   ════════════════════════════════════════════ */

const PRODUCTION_URL = ''; // ← ضع هنا رابط السيرفر الخلفي (Backend) بعد النشر (مثال: 'https://your-backend.up.railway.app' أو 'https://your-backend.onrender.com')

const API_BASE_URL = (() => {
  // 1. If PRODUCTION_URL is configured, always use it
  if (PRODUCTION_URL && PRODUCTION_URL.startsWith('http')) {
    return PRODUCTION_URL;
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // 2. Check if we are running in a local/development environment
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '' || protocol === 'file:';

  if (isLocal) {
    // If we are already on port 3000, use the current origin. Otherwise, default to port 3000 for the local backend
    if (window.location.port === '3000') {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  }

  // 3. In production static hosting (e.g. Netlify/Vercel/GitHub Pages), warn if PRODUCTION_URL is missing
  console.warn(
    '⚠️ [aizo.dz] تنبيه هام: لم يتم ضبط PRODUCTION_URL في js/config.js!\n' +
    'إذا كنت تستخدم استضافة ثابتة (Netlify / Vercel / GitHub Pages)، فلن يتم حفظ الطلبات في لوحة التحكم.\n' +
    'يرجى نشر السيرفر (على Render.com مثلاً) ووضع الرابط في PRODUCTION_URL.'
  );

  // Fallback to current window origin (if backend and frontend are hosted together)
  return window.location.origin;
})();

window.API_BASE_URL = API_BASE_URL;

console.log('[aizo.dz] API Base URL:', API_BASE_URL);


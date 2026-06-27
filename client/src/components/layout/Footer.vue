<template>
  <footer class="footer" id="footer">
    <div class="footer__grid">
      <div class="footer-col footer-col--brand">
        <a href="/" class="footer-logo">AIZO.DZ</a>
        <p class="footer-tagline" v-html="t('foot_tagline')"></p>
        <div class="footer-socials">
          <a href="#" class="social-link" aria-label="Instagram">
            <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="#" class="social-link" aria-label="TikTok">
            <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.54V6.78a4.86 4.86 0 01-1.07-.09z"/></svg>
          </a>
          <a href="#" class="social-link" aria-label="Facebook">
            <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
      </div>

      <div class="footer-col">
        <h4>{{ t('foot_shop') }}</h4>
        <ul>
          <li><RouterLink to="/#collection">{{ t('foot_new_arrivals') }}</RouterLink></li>
          <li><RouterLink to="/collections">{{ t('foot_best_sellers') }}</RouterLink></li>
          <li><RouterLink to="/collections">{{ t('foot_accessories') }}</RouterLink></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>{{ t('foot_info') }}</h4>
        <ul>
          <li><RouterLink to="/#about">{{ t('foot_our_story') }}</RouterLink></li>
          <li><a href="#">{{ t('foot_shipping') }}</a></li>
          <li><a href="#">{{ t('foot_privacy') }}</a></li>
          <li><a href="#">{{ t('foot_terms') }}</a></li>
          <li><a href="#">{{ t('foot_faq') }}</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>{{ t('foot_contact') }}</h4>
        <ul class="contact-list">
          <li class="contact-item">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
            <span>+213 XX XX XX XX</span>
          </li>
          <li class="contact-item">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            <span>contact@aizo.dz</span>
          </li>
          <li class="contact-item">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
            <span>Algérie</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <p>{{ t('foot_copy') }}</p>
      <p>{{ t('foot_made') }}</p>
    </div>
  </footer>
</template>

<script setup>
import { useLangStore } from '@/stores/lang.js'
const langStore = useLangStore()
const t = (key) => langStore.tr(key)
</script>

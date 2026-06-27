<template>
  <header class="navbar" :class="{ scrolled: isScrolled }" id="navbar" role="banner">
    <div class="navbar__inner">
      <RouterLink to="/" class="logo" id="logo" aria-label="AIZO.DZ home">AIZO.DZ</RouterLink>

      <nav aria-label="Main navigation">
        <ul class="nav-links">
          <li><RouterLink to="/#collection" class="nav-link">{{ t('nav_new_arrivals') }}</RouterLink></li>
          <li><RouterLink to="/collections" class="nav-link">{{ t('nav_collection') }}</RouterLink></li>
          <li><RouterLink to="/#about" class="nav-link">{{ t('nav_about') }}</RouterLink></li>
          <li><RouterLink to="/collections" class="btn-nav" id="shop-now-btn">{{ t('nav_shop_now') }}</RouterLink></li>
        </ul>
      </nav>

      <div class="navbar__actions">
        <!-- Language Selector -->
        <div class="lang-selector" id="lang-selector" ref="langSelectorRef">
          <button class="lang-btn" @click="toggleLangDropdown" aria-label="Change Language">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/>
            </svg>
            <span>{{ currentLangLabel }}</span>
          </button>
          <div class="lang-dropdown" :class="{ open: langOpen }">
            <button class="lang-option" :class="{ active: langStore.lang === 'ar' }" @click="setLang('ar')">🇩🇿 العربية</button>
            <button class="lang-option" :class="{ active: langStore.lang === 'fr' }" @click="setLang('fr')">🇫🇷 Français</button>
            <button class="lang-option" :class="{ active: langStore.lang === 'en' }" @click="setLang('en')">🇺🇸 English</button>
          </div>
        </div>

        <!-- Cart Trigger -->
        <button class="cart-trigger" id="cart-trigger" @click="cartStore.open()" aria-label="Open cart">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="22" height="22">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
          <span id="cart-count" class="cart-count" :class="{ visible: cartStore.totalCount > 0 }">{{ cartStore.totalCount }}</span>
        </button>

        <!-- Hamburger -->
        <button class="hamburger" id="hamburger" :class="{ open: menuOpen }" @click="toggleMenu" aria-label="Toggle menu" :aria-expanded="menuOpen">
          <span class="hamburger__bar"></span>
          <span class="hamburger__bar"></span>
          <span class="hamburger__bar"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <nav class="mobile-menu" :class="{ open: menuOpen }" id="mobile-menu" aria-label="Mobile navigation">
      <ul>
        <li><RouterLink to="/#collection" class="nav-link" @click="closeMenu">{{ t('nav_new_arrivals') }}</RouterLink></li>
        <li><RouterLink to="/collections" class="nav-link" @click="closeMenu">{{ t('nav_collection') }}</RouterLink></li>
        <li><RouterLink to="/#about" class="nav-link" @click="closeMenu">{{ t('nav_about') }}</RouterLink></li>
        <li><RouterLink to="/collections" class="btn-nav" style="align-self:flex-start" @click="closeMenu">{{ t('nav_shop_now') }}</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLangStore } from '@/stores/lang.js'
import { useCartStore } from '@/stores/cart.js'

const langStore = useLangStore()
const cartStore = useCartStore()

const isScrolled = ref(false)
const menuOpen = ref(false)
const langOpen = ref(false)
const langSelectorRef = ref(null)

const t = (key) => langStore.tr(key)

const currentLangLabel = computed(() => {
  const labels = { ar: 'AR', fr: 'FR', en: 'EN' }
  return labels[langStore.lang] || 'FR'
})

function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }
function toggleLangDropdown() { langOpen.value = !langOpen.value }

function setLang(lang) {
  langStore.setLang(lang)
  langOpen.value = false
}

function handleScroll() { isScrolled.value = window.scrollY > 50 }

function handleOutsideClick(e) {
  if (langSelectorRef.value && !langSelectorRef.value.contains(e.target)) {
    langOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleOutsideClick)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleOutsideClick)
})
</script>

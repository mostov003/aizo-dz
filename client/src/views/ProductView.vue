<template>
  <main class="product-page">
    <div v-if="loading" class="product-loading">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="!product" class="product-not-found">
      <h2>المنتج غير موجود / Produit non trouvé</h2>
      <RouterLink to="/collections" class="btn-primary">← {{ t('col_view_all') }}</RouterLink>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <nav class="product-breadcrumb" aria-label="Breadcrumb">
        <RouterLink to="/">Home</RouterLink>
        <span>›</span>
        <RouterLink to="/collections">{{ t('nav_collection') }}</RouterLink>
        <span>›</span>
        <span>{{ product.name }}</span>
      </nav>

      <!-- Product Layout -->
      <div class="product-layout">
        <!-- Image -->
        <div class="product-gallery">
          <div class="product-gallery__main">
            <img :src="product.img" :alt="product.alt || product.name" class="product-gallery__img" />
            <span v-if="product.badge" :class="`product-badge product-badge--${product.badgeType}`">{{ product.badge }}</span>
          </div>
        </div>

        <!-- Info -->
        <div class="product-info">
          <div class="section-eyebrow">{{ product.sub }}</div>
          <h1 class="product-info__title">{{ product.name }}</h1>

          <div class="product-info__rating">
            <span class="stars">{{ buildStars(product.stars) }}</span>
            <span class="rating-cnt">({{ product.reviews }} {{ t('reviews') }})</span>
          </div>

          <p class="product-info__price">{{ formatPrice(product.price) }} <span>DZD</span></p>

          <!-- Color Picker -->
          <div v-if="product.colors?.length > 0 && !(product.colors.length === 1 && product.colors[0] === 'بدون لون')" class="product-picker">
            <p class="product-picker__label">{{ t('pd_color') }}: <strong>{{ selectedColor }}</strong></p>
            <div class="product-picker__options">
              <button
                v-for="color in product.colors"
                :key="color"
                class="btn-color-chip"
                :class="{ active: selectedColor === color }"
                @click="selectedColor = color"
              >{{ color }}</button>
            </div>
          </div>

          <!-- Size Picker -->
          <div v-if="product.sizes?.length > 0" class="product-picker">
            <p class="product-picker__label">{{ t('pd_size') }}: <strong>{{ selectedSize }}</strong></p>
            <div class="product-picker__options">
              <button
                v-for="size in product.sizes"
                :key="size"
                class="btn-size-chip"
                :class="{ active: selectedSize === size, 'out-of-stock': getStock(size) <= 0 }"
                :disabled="getStock(size) <= 0"
                @click="selectedSize = size"
              >{{ size }}</button>
            </div>
          </div>

          <!-- Actions -->
          <div class="product-actions">
            <button class="btn-primary btn-add-to-cart-full" :id="`pd-add-cart-${product.id}`" @click="addToCart">
              {{ t('col_add_to_cart') }}
            </button>
            <RouterLink to="/customize" class="btn-secondary btn-customize">
              {{ t('pd_custom_order') }}
            </RouterLink>
          </div>

          <!-- Features -->
          <div class="product-features">
            <div class="product-feature-item">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
              <span>{{ t('pd_feat_shipping') }}</span>
            </div>
            <div class="product-feature-item">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg>
              <span>{{ t('pd_feat_quality') }}</span>
            </div>
            <div class="product-feature-item">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>
              <span>{{ t('pd_feat_returns') }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLangStore } from '@/stores/lang.js'
import { useProductsStore } from '@/stores/products.js'
import { useCartStore } from '@/stores/cart.js'

const route = useRoute()
const langStore = useLangStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const t = (key) => langStore.tr(key)
const loading = ref(true)

const product = computed(() => productsStore.getById(route.params.id))
const selectedColor = ref('')
const selectedSize = ref('')

function formatPrice(price) {
  const num = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price
  return num.toLocaleString()
}

function buildStars(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count)
}

function getStock(size) {
  return productsStore.getStockForVariant(product.value?.id, selectedColor.value, size)
}

function addToCart() {
  if (!product.value) return
  cartStore.add(product.value, selectedColor.value || 'بدون لون', selectedSize.value || 'M')
}

onMounted(async () => {
  await productsStore.load()
  loading.value = false
  if (product.value) {
    const hasColors = product.value.colors?.length > 0 && !(product.value.colors.length === 1 && product.value.colors[0] === 'بدون لون')
    selectedColor.value = hasColors ? product.value.colors[0] : 'بدون لون'
    selectedSize.value = product.value.sizes?.[0] || 'M'
  }
})
</script>

<style scoped>
.product-page {
  min-height: 80vh;
  padding: 2rem var(--space-side);
  max-width: 1400px;
  margin: 0 auto;
}

.product-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.product-not-found {
  text-align: center;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.product-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.product-breadcrumb a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.product-breadcrumb a:hover { color: var(--color-text); }

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

@media (max-width: 768px) {
  .product-layout { grid-template-columns: 1fr; gap: 2rem; }
}

.product-gallery__main {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background: var(--color-surface);
}

.product-gallery__img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
}

.product-info { display: flex; flex-direction: column; gap: 1.25rem; }

.product-info__title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 400;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0;
}

.product-info__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.stars { color: var(--color-accent); letter-spacing: 2px; }
.rating-cnt { color: var(--color-text-muted); }

.product-info__price {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.product-info__price span { font-size: 0.875rem; color: var(--color-text-muted); font-weight: 400; }

.product-picker { display: flex; flex-direction: column; gap: 0.75rem; }

.product-picker__label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

.product-picker__options { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.btn-color-chip, .btn-size-chip {
  padding: 0.4rem 1rem;
  border: 1.5px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 0.8125rem;
  font-family: var(--font-body);
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
}

.btn-color-chip.active, .btn-size-chip.active {
  border-color: var(--color-text);
  background: var(--color-text);
  color: var(--color-bg);
}

.btn-size-chip.out-of-stock {
  opacity: 0.35;
  cursor: not-allowed;
  text-decoration: line-through;
}

.product-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

.btn-add-to-cart-full {
  flex: 1;
  padding: 1rem 2rem;
  font-size: 0.875rem;
  letter-spacing: 0.1em;
}

.btn-customize {
  padding: 1rem 1.5rem;
  border: 1.5px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 0.8125rem;
  font-family: var(--font-body);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  letter-spacing: 0.05em;
  transition: all 0.2s;
  border-radius: 2px;
}

.btn-customize:hover { border-color: var(--color-text); }

.product-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.product-feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.product-feature-item svg { stroke: var(--color-text-muted); flex-shrink: 0; }
</style>

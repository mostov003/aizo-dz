<template>
  <main>
    <!-- Hero -->
    <section class="coll-hero" aria-label="Collections hero">
      <div class="coll-hero__content">
        <div class="section-eyebrow">aizo.dz</div>
        <h1 class="coll-hero__title">{{ t('coll_hero_title') }}</h1>
        <p class="coll-hero__desc">{{ t('coll_hero_desc') }}</p>
      </div>
    </section>

    <!-- Filters & Grid -->
    <section class="collections-page" aria-label="Products">
      <div class="section-inner">
        <div class="collections-toolbar">
          <!-- Search -->
          <div class="coll-search-wrap">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <input type="text" v-model="search" :placeholder="t('coll_search_ph')" id="coll-search" class="coll-search" />
          </div>

          <!-- Sort -->
          <select v-model="sortBy" class="coll-sort-select" id="coll-sort">
            <option value="featured">{{ t('coll_featured') }}</option>
            <option value="price-asc">{{ t('coll_price_asc') }}</option>
            <option value="price-desc">{{ t('coll_price_desc') }}</option>
            <option value="name-asc">{{ t('coll_name_asc') }}</option>
            <option value="name-desc">{{ t('coll_name_desc') }}</option>
          </select>
        </div>

        <!-- Category Filters (below search) -->
        <div class="coll-filter-bar">
          <h4 class="coll-filter-title">{{ t('coll_categories') }}</h4>
          <div class="coll-filter-buttons">
            <button
              v-for="cat in ['all', 'Jeans', 'Jackets', 'Hoodies', 'Accessories', 'Shorts', 'T-shirt', 'Jorts']"
              :key="cat"
              class="coll-filter-btn"
              :class="{ active: activeCategory === cat }"
              @click="setCategory(cat)"
            >{{ getCatLabel(cat) }}</button>
          </div>
        </div>

        <!-- Grid -->
        <div class="coll-main">
          <div class="coll-meta">
            <span>{{ t('coll_showing') }} <strong>{{ filteredProducts.length }}</strong> {{ t('coll_products') }}</span>
          </div>
          <div class="product-grid" id="product-grid">
            <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
          </div>
          <div v-if="filteredProducts.length === 0" class="coll-empty">
            <p>Aucun produit trouvé / لا توجد منتجات</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLangStore } from '@/stores/lang.js'
import { useProductsStore } from '@/stores/products.js'
import ProductCard from '@/components/home/ProductCard.vue'

const langStore = useLangStore()
const productsStore = useProductsStore()
const route = useRoute()

const t = (key) => langStore.tr(key)
const search = ref('')
const sortBy = ref('featured')
const activeCategory = ref('all')

const filteredProducts = computed(() => productsStore.filter({
  category: activeCategory.value, search: search.value, sort: sortBy.value
}))

function setCategory(cat) { activeCategory.value = cat }
function getCatLabel(cat) {
  const map = { all: t('coll_all'), Jeans: t('coll_denim'), Jackets: t('coll_jackets'), Hoodies: t('coll_hoodies'), Accessories: t('coll_accessories'), Shorts: t('coll_shorts'), 'T-shirt': t('coll_tshirt'), Jorts: t('coll_jorts') }
  return map[cat] || cat
}

onMounted(async () => {
  await productsStore.load()
  // Handle category from query param
  if (route.query.category) activeCategory.value = route.query.category
})

watch(() => route.query.category, (cat) => {
  if (cat) activeCategory.value = cat
})
</script>

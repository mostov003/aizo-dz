<template>
  <main>
    <!-- ── HERO ── -->
    <section class="hero" id="hero" aria-label="Hero">
      <div class="hero__bg-image"></div>
      <div class="hero__overlay"></div>
      <div class="hero__bg">
        <div class="hero__blob-1"></div>
        <div class="hero__blob-2"></div>
      </div>
      <div class="hero__content">
        <div class="hero__line" aria-hidden="true"></div>
        <div class="hero__eyebrow">aizo.dz</div>
        <h1 class="hero__title">Premium Streetwear<br/><em>Algeria</em></h1>
        <p class="hero__subtitle">{{ t('feat_delivery') }}</p>
        <div class="hero__actions">
          <RouterLink to="/collections" class="btn-shop-hero" id="hero-cta">
            {{ t('hero_shop_now') }}
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/></svg>
          </RouterLink>
          <button class="btn-ghost" @click="scrollToCollection">{{ t('col_view_all') }}</button>
        </div>
        <div class="scroll-indicator" aria-hidden="true">
          <span>SCROLL</span>
          <div class="scroll-indicator__line"></div>
        </div>
      </div>
    </section>

    <!-- ── MARQUEE ── -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <span v-for="n in 6" :key="n" style="display:contents">
          <span class="marquee__item">✦ {{ t('marquee_1') }}</span>
          <span class="marquee__dot">·</span>
          <span class="marquee__item">{{ t('marquee_2') }}</span>
          <span class="marquee__dot">·</span>
          <span class="marquee__item">{{ t('marquee_3') }}</span>
          <span class="marquee__dot">·</span>
          <span class="marquee__item">{{ t('marquee_4') }}</span>
          <span class="marquee__dot">·</span>
          <span class="marquee__item">{{ t('marquee_5') }}</span>
          <span class="marquee__dot">·</span>
          <span class="marquee__item">{{ t('marquee_6') }}</span>
          <span class="marquee__dot">·</span>
        </span>
      </div>
    </div>

    <!-- ── CATEGORY BANNERS ── -->
    <div class="category-banners" id="categories">
      <div class="category-banners__inner">
        <div class="section-eyebrow category-banners__title">{{ t('cat_shop_by') }}</div>
        <div class="category-banners__grid">
          <div class="category-banner" @click="goToCategory('Jeans')" id="banner-jeans">
            <img src="https://i.pinimg.com/736x/5b/0e/55/5b0e55765d14b77877e75fca2315ae6f.jpg" alt="Jeans Collection" loading="lazy" />
            <div class="category-banner__content">
              <span class="category-banner__name">{{ t('cat_jeans') }}</span>
              <button class="category-banner__btn">{{ t('cat_shop_denim') }}</button>
            </div>
          </div>
          <div class="category-banner" @click="goToCategory('Jackets')" id="banner-jackets">
            <img src="https://i.pinimg.com/736x/fa/14/b3/fa14b392e687ec62d0bbe320e81ca10d.jpg" alt="Jackets Collection" loading="lazy" />
            <div class="category-banner__content">
              <span class="category-banner__name">{{ t('cat_jackets') }}</span>
              <button class="category-banner__btn">{{ t('cat_shop_jackets') }}</button>
            </div>
          </div>
          <div class="category-banner" @click="goToCategory('Hoodies')" id="banner-hoodies">
            <img src="https://i.pinimg.com/736x/2b/5d/60/2b5d60ac344515aada335e3ce17938aa.jpg" alt="Hoodies Collection" loading="lazy" />
            <div class="category-banner__content">
              <span class="category-banner__name">{{ t('cat_hoodies') }}</span>
              <button class="category-banner__btn">{{ t('cat_shop_hoodies') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── COLLECTION ── -->
    <section class="section-collection" id="collection" aria-label="Collection">
      <div class="section-collection__inner">
        <div class="collection-header">
          <div>
            <div class="section-eyebrow">{{ t('col_eyebrow') }}</div>
            <h2>{{ t('col_title') }}</h2>
          </div>
          <RouterLink to="/collections" class="view-all">{{ t('col_view_all') }}</RouterLink>
        </div>

        <!-- Category Filter -->
        <div class="category-filter" role="tablist">
          <button
            v-for="cat in ['all', 'Jeans', 'Jackets', 'Hoodies', 'Accessories', 'Shorts', 'T-shirt', 'Jorts']"
            :key="cat"
            class="category-btn"
            :class="{ 'category-btn--active': activeCategory === cat }"
            @click="setCategory(cat)"
            role="tab"
          >{{ getCatLabel(cat) }}</button>
        </div>

        <!-- Product Grid -->
        <div class="product-grid" id="product-grid">
          <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product" />
        </div>

        <!-- Load More -->
        <div class="load-more-wrap" v-if="displayedProducts.length < filteredProducts.length">
          <button class="btn-outline" @click="loadMore">{{ t('col_load_more') }}</button>
        </div>
      </div>
    </section>

    <!-- ── ABOUT ── -->
    <section class="section-about" id="about" aria-label="About">
      <div class="section-about__inner">
        <div class="section-eyebrow reveal">{{ t('about_eyebrow') }}</div>
        <h2 class="section-title reveal delay-1" v-html="t('about_title')"></h2>
        <p class="section-body reveal delay-2">{{ t('about_body') }}</p>
        <div class="divider reveal delay-3">
          <div class="divider__line"></div>
          <span class="divider__star">✦</span>
          <div class="divider__line"></div>
        </div>
        <RouterLink to="/collections" class="btn-primary reveal delay-3" style="margin-top:2.5rem;display:inline-flex;">
          {{ t('hero_shop_now') }}
          <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/></svg>
        </RouterLink>
      </div>
    </section>

    <!-- ── NEWSLETTER ── -->
    <section class="section-newsletter" id="newsletter" aria-label="Newsletter">
      <div class="section-newsletter__inner">
        <div class="section-eyebrow reveal">{{ t('nl_eyebrow') }}</div>
        <h2 class="section-title reveal delay-1" v-html="t('nl_title')"></h2>
        <p class="section-body reveal delay-2">{{ t('nl_body') }}</p>

        <form class="nl-form reveal delay-2" id="nl-form" @submit.prevent="submitNewsletter" v-if="!nlSuccess">
          <input type="email" v-model="nlEmail" :placeholder="t('nl_placeholder')" id="nl-email" class="nl-input" />
          <button type="submit" class="btn-subscribe">{{ t('nl_subscribe') }}</button>
        </form>
        <p v-else class="nl-success show" id="nl-success">{{ t('nl_success') }}</p>

        <div class="captcha-row reveal" style="display:flex;gap:0.75rem;align-items:center;justify-content:center;margin-top:1rem;" v-if="!nlSuccess">
          <span id="nl-captcha-question" style="font-size:0.8125rem;color:var(--color-stone-500);">{{ nlCaptchaQ }}</span>
          <input type="number" v-model="nlCaptchaAnswer" id="nl-captcha-answer" style="width:70px;padding:0.4rem 0.6rem;border:1px solid #3c3835;background:#292524;color:#d6d3d1;font-size:0.8125rem;" placeholder="= ?" />
        </div>
      </div>
    </section>

    <!-- ── FEATURES ── -->
    <section class="section-features" aria-label="Features">
      <div class="section-features__grid">
        <div class="feature reveal">
          <div class="feature__icon">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
          </div>
          <h3 class="feature__title">{{ t('feat_delivery') }}</h3>
          <p class="feature__body">{{ t('feat_delivery_desc') }}</p>
        </div>
        <div class="feature reveal delay-1">
          <div class="feature__icon">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg>
          </div>
          <h3 class="feature__title">{{ t('feat_auth') }}</h3>
          <p class="feature__body">{{ t('feat_auth_desc') }}</p>
        </div>
        <div class="feature reveal delay-2">
          <div class="feature__icon">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>
          </div>
          <h3 class="feature__title">{{ t('feat_returns') }}</h3>
          <p class="feature__body">{{ t('feat_returns_desc') }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLangStore } from '@/stores/lang.js'
import { useProductsStore } from '@/stores/products.js'
import ProductCard from '@/components/home/ProductCard.vue'

const langStore = useLangStore()
const productsStore = useProductsStore()
const router = useRouter()

const t = (key) => langStore.tr(key)

// Products
const activeCategory = ref('all')
const visibleCount = ref(8)

const filteredProducts = computed(() => productsStore.filter({ category: activeCategory.value }))
const displayedProducts = computed(() => filteredProducts.value.slice(0, visibleCount.value))

function setCategory(cat) { activeCategory.value = cat; visibleCount.value = 8 }
function loadMore() { visibleCount.value += 4 }

function getCatLabel(cat) {
  const map = { all: t('cat_all'), Jeans: t('cat_jeans'), Jackets: t('cat_jackets'), Hoodies: t('cat_hoodies'), Accessories: t('cat_accessories'), Shorts: t('cat_shorts'), 'T-shirt': t('cat_tshirt'), Jorts: t('cat_jorts') }
  return map[cat] || cat
}

function goToCategory(cat) {
  router.push(`/collections?category=${cat}`)
}

function scrollToCollection() {
  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
}

// Newsletter
const nlEmail = ref('')
const nlSuccess = ref(false)
const nlCaptchaA = ref(0)
const nlCaptchaB = ref(0)
const nlCaptchaAnswer = ref('')
const nlCaptchaQ = ref('')

function initNlCaptcha() {
  nlCaptchaA.value = Math.floor(Math.random() * 9) + 1
  nlCaptchaB.value = Math.floor(Math.random() * 9) + 1
  nlCaptchaQ.value = `${nlCaptchaA.value} + ${nlCaptchaB.value} =`
  nlCaptchaAnswer.value = ''
}

async function submitNewsletter() {
  const expected = nlCaptchaA.value + nlCaptchaB.value
  if (parseInt(nlCaptchaAnswer.value) !== expected) {
    alert('⚠️ كود الأمان غير صحيح / CAPTCHA incorrect')
    initNlCaptcha()
    return
  }
  const leadData = { email: nlEmail.value.trim(), date: new Date().toISOString() }
  try {
    const res = await fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    })
    if (!res.ok) throw new Error()
  } catch {
    const local = JSON.parse(localStorage.getItem('local_leads') || '[]')
    if (!local.some(l => l.email === leadData.email)) {
      local.push(leadData)
      localStorage.setItem('local_leads', JSON.stringify(local))
    }
  }
  nlSuccess.value = true
}

// Reveal Observer
let revealObserver = null
function setupReveal() {
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target) } })
  }, { threshold: 0.08 })
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))
}

onMounted(async () => {
  await productsStore.load()
  initNlCaptcha()
  setTimeout(setupReveal, 100)
})

onUnmounted(() => {
  if (revealObserver) revealObserver.disconnect()
})
</script>

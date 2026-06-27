import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DEFAULT_PRODUCTS } from '@/data/products.js'

export const useProductsStore = defineStore('products', () => {
  const products = ref([...DEFAULT_PRODUCTS])
  const stocks = ref({})
  const loaded = ref(false)

  const categories = computed(() => {
    const cats = new Set(products.value.map(p => p.category).filter(Boolean))
    return ['all', ...cats]
  })

  async function load(force = false) {
    if (loaded.value && !force) return
    try {
      // Load stocks
      const stockRes = await fetch('/api/product-stocks', { signal: AbortSignal?.timeout?.(5000) })
      if (stockRes.ok) stocks.value = await stockRes.json()
    } catch {}

    try {
      // Load overrides for default products
      const overridesRes = await fetch('/api/default-overrides', { signal: AbortSignal?.timeout?.(5000) })
      let overrides = {}
      if (overridesRes.ok) overrides = await overridesRes.json()
      localStorage.setItem('default_overrides', JSON.stringify(overrides))

      let processed = DEFAULT_PRODUCTS.map(p => {
        const ov = overrides[p.id]
        return ov ? { ...p, ...ov } : p
      }).filter(p => !p.hidden)

      // Load custom products from API
      const custRes = await fetch('/api/custom-products', { signal: AbortSignal?.timeout?.(5000) })
      if (custRes.ok) {
        const custom = await custRes.json()
        localStorage.setItem('custom_products', JSON.stringify(custom))
        products.value = [...processed, ...custom]
      } else {
        const localCustom = JSON.parse(localStorage.getItem('custom_products') || '[]')
        products.value = [...processed, ...localCustom]
      }
    } catch {
      // Fallback to localStorage
      const localOverrides = JSON.parse(localStorage.getItem('default_overrides') || '{}')
      let processed = DEFAULT_PRODUCTS.map(p => {
        const ov = localOverrides[p.id]
        return ov ? { ...p, ...ov } : p
      }).filter(p => !p.hidden)
      const localCustom = JSON.parse(localStorage.getItem('custom_products') || '[]')
      products.value = [...processed, ...localCustom]
    }
    loaded.value = true
  }

  function getById(id) {
    return products.value.find(p => p.id === parseInt(id) || p.id === id)
  }

  function getStockForVariant(productId, color, size) {
    const key = `${productId}-${color}-${size}`
    return stocks.value[key] !== undefined ? stocks.value[key] : 10
  }

  function filter({ category = 'all', search = '', sort = 'featured' }) {
    let result = [...products.value]
    if (category && category !== 'all') {
      result = result.filter(p => p.category?.toLowerCase() === category.toLowerCase())
    }
    if (search) {
      const q = search.toLowerCase().trim()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.sub?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'name-desc') result.sort((a, b) => b.name.localeCompare(a.name))
    return result
  }

  return { products, stocks, loaded, categories, load, getById, getStockForVariant, filter }
})

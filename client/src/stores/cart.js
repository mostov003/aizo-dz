import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getShippingCost } from '@/data/delivery.js'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isOpen = ref(false)

  // Load from localStorage on init
  function load() {
    try {
      items.value = JSON.parse(localStorage.getItem('aizo_cart') || '[]')
    } catch {
      items.value = []
    }
  }

  function save() {
    localStorage.setItem('aizo_cart', JSON.stringify(items.value))
  }

  const totalCount = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
  const subtotal = computed(() => items.value.reduce((acc, i) => acc + i.price * i.quantity, 0))

  function getShipping(wilayaCode, deliveryType) {
    if (!wilayaCode) return 600
    return getShippingCost(wilayaCode, deliveryType)
  }

  function add(product, color, size) {
    const existing = items.value.find(
      i => i.id === product.id && i.color === color && i.size === size
    )
    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        sub: product.sub,
        price: typeof product.price === 'string'
          ? parseFloat(product.price.replace(/,/g, ''))
          : product.price,
        img: product.img,
        color: color || 'أسود',
        size: size || 'M',
        quantity: 1
      })
    }
    save()
    isOpen.value = true
  }

  function remove(productId, color, size) {
    items.value = items.value.filter(
      i => !(i.id === productId && i.color === color && i.size === size)
    )
    save()
  }

  function updateQty(productId, color, size, delta) {
    const item = items.value.find(i => i.id === productId && i.color === color && i.size === size)
    if (!item) return
    item.quantity += delta
    if (item.quantity <= 0) remove(productId, color, size)
    else save()
  }

  function clear() {
    items.value = []
    save()
  }

  function open() { isOpen.value = true }
  function close() { isOpen.value = false }

  load()

  return { items, isOpen, totalCount, subtotal, add, remove, updateQty, clear, open, close, getShipping, load }
})

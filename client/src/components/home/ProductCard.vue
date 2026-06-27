<template>
  <article class="product-card reveal" :id="`product-${product.id}`">
    <RouterLink :to="`/product/${product.id}`" class="product-card__link" :aria-label="`View ${product.name}`">
      <div class="product-card__image-wrap" ref="imgWrapRef">
        <img class="product-card__img product-card__img--primary" :src="product.img" :alt="product.alt || product.name" loading="lazy" />
        <span v-if="product.badge" :class="`product-badge product-badge--${product.badgeType}`">{{ product.badge }}</span>

        <!-- Add to Cart overlay -->
        <div class="product-card__cta">
          <button
            class="btn-add-cart"
            :id="`add-cart-${product.id}`"
            @click.prevent="handleAddToCart"
            :aria-label="`Add ${product.name} to cart`"
          >{{ t('col_add_to_cart') }}</button>
        </div>

        <!-- Color/Size picker overlay -->
        <Transition name="picker">
          <div v-if="pickerStep" class="size-picker-overlay active">
            <button class="size-picker-close" @click.prevent="pickerStep = null">×</button>
            
            <!-- Step 1: Colors -->
            <template v-if="pickerStep === 'color'">
              <p class="size-picker-title">{{ t('pick_color') }}</p>
              <div class="size-picker-options color-options">
                <button v-for="color in product.colors" :key="color" class="btn-size-option btn-color-option" @click.prevent="selectColor(color)">{{ color }}</button>
              </div>
            </template>

            <!-- Step 2: Sizes -->
            <template v-else-if="pickerStep === 'size'">
              <p class="size-picker-title">{{ t('pick_size') }} {{ selectedColor !== 'بدون لون' ? `(${selectedColor})` : '' }}</p>
              <div class="size-picker-options">
                <button
                  v-for="size in product.sizes"
                  :key="size"
                  class="btn-size-option btn-sz-select"
                  :disabled="getStock(size) <= 0"
                  :style="getStock(size) <= 0 ? 'opacity:0.4;text-decoration:line-through;cursor:not-allowed;' : ''"
                  @click.prevent="selectSize(size)"
                >{{ size }}{{ getStock(size) <= 0 ? ' (نفذ)' : '' }}</button>
              </div>
            </template>
          </div>
        </Transition>
      </div>

      <div class="product-card__info">
        <div>
          <p class="product-card__name">{{ product.name }}</p>
          <p class="product-card__sub">{{ product.sub }}</p>
        </div>
        <p class="product-card__price">{{ formatPrice(product.price) }} <span>DZD</span></p>
      </div>
      <div class="product-card__rating">
        <span class="stars">{{ buildStars(product.stars) }}</span>
        <span class="rating-cnt">({{ product.reviews }})</span>
      </div>
    </RouterLink>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { useLangStore } from '@/stores/lang.js'
import { useCartStore } from '@/stores/cart.js'
import { useProductsStore } from '@/stores/products.js'

const props = defineProps({ product: { type: Object, required: true } })
const langStore = useLangStore()
const cartStore = useCartStore()
const productsStore = useProductsStore()

const t = (key) => langStore.tr(key)
const pickerStep = ref(null) // null | 'color' | 'size'
const selectedColor = ref('أسود')

function formatPrice(price) {
  const num = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price
  return num.toLocaleString()
}

function buildStars(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count)
}

function getStock(size) {
  return productsStore.getStockForVariant(props.product.id, selectedColor.value, size)
}

function handleAddToCart() {
  const hasColors = props.product.colors?.length > 0 && !(props.product.colors.length === 1 && props.product.colors[0] === 'بدون لون')
  const hasSizes = props.product.sizes?.length > 0

  if (hasColors) {
    pickerStep.value = 'color'
  } else if (hasSizes) {
    selectedColor.value = 'بدون لون'
    pickerStep.value = 'size'
  } else {
    cartStore.add(props.product, 'بدون لون', 'M')
  }
}

function selectColor(color) {
  selectedColor.value = color
  const hasSizes = props.product.sizes?.length > 0
  if (hasSizes) {
    pickerStep.value = 'size'
  } else {
    cartStore.add(props.product, color, 'M')
    pickerStep.value = null
  }
}

function selectSize(size) {
  cartStore.add(props.product, selectedColor.value, size)
  pickerStep.value = null
}
</script>

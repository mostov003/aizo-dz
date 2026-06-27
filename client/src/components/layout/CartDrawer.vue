<template>
  <!-- Cart Backdrop -->
  <div class="cart-drawer-backdrop" :class="{ active: cartStore.isOpen }" @click="cartStore.close()"></div>

  <!-- Cart Drawer -->
  <aside class="cart-drawer" :class="{ active: cartStore.isOpen }" id="cart-drawer" role="complementary" aria-label="Shopping Cart">
    <div class="cart-drawer__header">
      <h2>{{ t('cart_title_ar') }} <span style="color: var(--color-stone-400); font-weight:300;">{{ t('cart_title_en') }}</span></h2>
      <button class="btn-close-cart" id="btn-close-cart" @click="cartStore.close()" aria-label="Close cart">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="cart-drawer__body">
      <!-- Empty State -->
      <div v-if="cartStore.items.length === 0 && !orderSuccess" class="cart-empty" id="cart-empty">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="1" width="64" height="64" style="color: var(--color-stone-300)">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
        </svg>
        <p class="cart-empty__title">{{ t('cart_empty_ar') }}</p>
        <p class="cart-empty__sub">{{ t('cart_empty_en') }}</p>
        <RouterLink to="/collections" class="btn-primary btn-empty-shop" id="btn-empty-shop" @click="cartStore.close()">{{ t('cart_shop_now') }}</RouterLink>
      </div>

      <!-- Order Success -->
      <div v-if="orderSuccess" class="order-success-screen" id="order-success-screen" style="display:block;">
        <div class="success-icon">✓</div>
        <h3 class="success-title">{{ t('success_title') }}</h3>
        <p class="success-subtitle">{{ t('success_subtitle') }}</p>
        <div class="success-details">
          <div class="success-row"><span>{{ t('success_order_label') }}</span><strong id="success-order-id">{{ successData.id }}</strong></div>
          <div class="success-row"><span>{{ t('success_name_label') }}</span><strong>{{ successData.name }}</strong></div>
          <div class="success-row"><span>{{ t('success_phone_label') }}</span><strong>{{ successData.phone }}</strong></div>
          <div class="success-row"><span>{{ t('success_wilaya_label') }}</span><strong>{{ successData.wilaya }}</strong></div>
          <div class="success-row"><span>{{ t('success_delivery_label') }}</span><strong>{{ successData.delivery }}</strong></div>
          <div class="success-row"><span>{{ t('success_total_label') }}</span><strong>{{ successData.total?.toLocaleString() }} DZD</strong></div>
        </div>
        <button class="btn-primary btn-success-close" id="btn-success-close" @click="closeSuccess">{{ t('success_continue') }}</button>
      </div>

      <!-- Cart Items + Checkout -->
      <div v-if="cartStore.items.length > 0 && !orderSuccess" id="cart-checkout-section">
        <!-- Items List -->
        <div class="cart-items-list" id="cart-items-list">
          <div v-for="item in cartStore.items" :key="`${item.id}-${item.color}-${item.size}`" class="cart-item">
            <div class="cart-item__img-wrap">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="cart-item__details">
              <div>
                <p class="cart-item__title">{{ item.name }}</p>
                <div style="display:flex;gap:6px;margin:4px 0;">
                  <span v-if="item.color" style="background:var(--color-stone-100);padding:2px 6px;border-radius:4px;font-size:0.75rem;">{{ t('pd_color') }}: {{ item.color }}</span>
                  <span v-if="item.size" style="background:var(--color-stone-100);padding:2px 6px;border-radius:4px;font-size:0.75rem;">{{ t('pd_size') }}: {{ item.size }}</span>
                </div>
                <button class="btn-remove-item" @click="cartStore.remove(item.id, item.color, item.size)">حذف / Remove</button>
              </div>
              <div class="cart-item__meta">
                <div class="qty-selector">
                  <button class="qty-btn" @click="cartStore.updateQty(item.id, item.color, item.size, -1)">-</button>
                  <span class="qty-val">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="cartStore.updateQty(item.id, item.color, item.size, 1)">+</button>
                </div>
                <span class="cart-item__price">{{ (item.price * item.quantity).toLocaleString() }} DZD</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-row"><span>{{ t('cart_subtotal') }}</span><span id="cart-subtotal">{{ cartStore.subtotal.toLocaleString() }} DZD</span></div>
          <div class="summary-row"><span>{{ t('cart_shipping_label') }}</span><span id="cart-shipping">{{ shippingCost.toLocaleString() }} DZD</span></div>
          <div class="summary-row summary-total"><span>{{ t('cart_total') }}</span><span id="cart-total">{{ (cartStore.subtotal + shippingCost).toLocaleString() }} DZD</span></div>
        </div>

        <!-- Checkout Form -->
        <div class="checkout-header">
          <h3>{{ t('checkout_title_ar') }} <span>{{ t('checkout_title_en') }}</span></h3>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMsg" class="checkout-error-alert" style="display:flex;" id="checkout-error-alert">
          <div class="alert-content">{{ errorMsg }}</div>
          <button @click="errorMsg = ''" class="btn-close-alert" id="checkout-error-close">×</button>
        </div>

        <form class="checkout-form" id="checkout-form" @submit.prevent="submitOrder">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('checkout_name_label') }}</label>
              <input type="text" v-model="form.name" :placeholder="t('checkout_name_ph')" />
              <span v-if="errors.name" class="field-error show">{{ t('err_name') }}</span>
            </div>
            <div class="form-group">
              <label>{{ t('checkout_surname_label') }}</label>
              <input type="text" v-model="form.surname" :placeholder="t('checkout_surname_ph')" />
              <span v-if="errors.surname" class="field-error show">{{ t('err_surname') }}</span>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('checkout_phone_label') }}</label>
            <input type="tel" v-model="form.phone" :placeholder="t('checkout_phone_ph')" />
            <span v-if="errors.phone" class="field-error show">{{ t('err_phone') }}</span>
          </div>
          <div class="form-group">
            <label>{{ t('checkout_wilaya_label') }}</label>
            <select v-model="form.wilaya" @change="onWilayaChange">
              <option value="">{{ t('checkout_wilaya_ph') }}</option>
              <option v-for="w in wilayas" :key="w.code" :value="w.code">{{ w.name }}</option>
            </select>
            <span v-if="errors.wilaya" class="field-error show">{{ t('err_wilaya') }}</span>
          </div>

          <!-- Delivery Type -->
          <div class="form-group">
            <label>{{ t('checkout_delivery_type') }}</label>
            <div class="delivery-options">
              <label class="delivery-option-card" :class="{ active: form.deliveryType === 'home' }">
                <input type="radio" name="delivery-type" value="home" v-model="form.deliveryType" @change="onDeliveryChange" />
                <div class="option-content">
                  <span class="option-title">{{ t('delivery_home') }}</span>
                  <span class="option-desc">{{ t('delivery_home_desc') }}</span>
                </div>
                <span v-if="form.wilaya" class="option-price" id="home-delivery-price">{{ homeDeliveryPrice.toLocaleString() }} DZD</span>
              </label>
              <label class="delivery-option-card" :class="{ active: form.deliveryType === 'office' }">
                <input type="radio" name="delivery-type" value="office" v-model="form.deliveryType" @change="onDeliveryChange" />
                <div class="option-content">
                  <span class="option-title">{{ t('delivery_office') }}</span>
                  <span class="option-desc">{{ t('delivery_office_desc') }}</span>
                </div>
                <span v-if="form.wilaya" class="option-price" id="office-delivery-price">{{ officeDeliveryPrice.toLocaleString() }} DZD</span>
              </label>
            </div>
          </div>

          <!-- Home Address -->
          <div v-if="form.deliveryType === 'home'" class="form-group" id="home-address-group" style="display:flex;flex-direction:column;">
            <label>{{ t('checkout_address_label') }}</label>
            <input type="text" v-model="form.address" :placeholder="t('checkout_address_ph')" />
            <span v-if="errors.address" class="field-error show">{{ t('err_address') }}</span>
          </div>

          <!-- Office Select -->
          <div v-if="form.deliveryType === 'office'" class="form-group" id="office-select-group" style="display:flex;flex-direction:column;">
            <label>{{ t('checkout_office_label') }}</label>
            <select v-model="form.office">
              <option value="">{{ form.wilaya ? t('checkout_office_ph') : t('choose_office_first') }}</option>
              <option v-for="off in filteredOffices" :key="off.name" :value="`${off.name} - (${off.address})`">{{ off.name }} - ({{ off.address }})</option>
            </select>
            <span v-if="errors.office" class="field-error show">{{ t('err_office') }}</span>
          </div>

          <button type="submit" class="btn-primary btn-confirm-order" id="btn-confirm-order" :disabled="submitting">
            {{ submitting ? t('checkout_sending') : t('checkout_confirm') }}
          </button>
        </form>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useLangStore } from '@/stores/lang.js'
import { useCartStore } from '@/stores/cart.js'
import { useNotifications } from '@/composables/useNotifications.js'
import { WILAYAS, ZR_OFFICES, getShippingCost } from '@/data/delivery.js'

const langStore = useLangStore()
const cartStore = useCartStore()
const { sendAll } = useNotifications()

const t = (key) => langStore.tr(key)

const wilayas = WILAYAS
const orderSuccess = ref(false)
const successData = ref({})
const submitting = ref(false)
const errorMsg = ref('')

const form = ref({
  name: '', surname: '', phone: '', wilaya: '', deliveryType: 'home', address: '', office: ''
})
const errors = ref({ name: false, surname: false, phone: false, wilaya: false, address: false, office: false })

const homeDeliveryPrice = computed(() => form.value.wilaya ? getShippingCost(form.value.wilaya, 'home') : 0)
const officeDeliveryPrice = computed(() => form.value.wilaya ? getShippingCost(form.value.wilaya, 'office') : 0)
const shippingCost = computed(() => {
  if (!form.value.wilaya) return 600
  return getShippingCost(form.value.wilaya, form.value.deliveryType)
})

const filteredOffices = computed(() => {
  if (!form.value.wilaya) return []
  return ZR_OFFICES.filter(o => o.wilaya === parseInt(form.value.wilaya))
})

function onWilayaChange() { form.value.office = '' }
function onDeliveryChange() { form.value.office = ''; form.value.address = '' }

function validate() {
  let valid = true
  errors.value.name = !form.value.name.trim() || form.value.name.trim().length < 2
  errors.value.surname = !form.value.surname.trim() || form.value.surname.trim().length < 2
  const phoneRegex = /^(05|06|07)\d{8}$/
  errors.value.phone = !phoneRegex.test(form.value.phone.trim().replace(/\s+/g, ''))
  errors.value.wilaya = !form.value.wilaya
  errors.value.address = form.value.deliveryType === 'home' && (!form.value.address.trim() || form.value.address.trim().length < 5)
  errors.value.office = form.value.deliveryType === 'office' && !form.value.office
  return !Object.values(errors.value).some(Boolean)
}

async function submitOrder() {
  if (!validate()) return
  submitting.value = true
  const subtotal = cartStore.subtotal
  const shipping = shippingCost.value
  const total = subtotal + shipping
  const orderId = 'AZ-' + Math.floor(1000 + Math.random() * 9000)
  const deliveryText = form.value.deliveryType === 'home'
    ? `التوصيل إلى المنزل (A DOMICILE) — ${form.value.address}`
    : `التوصيل إلى المكتب (STOP DESK) - ${form.value.office}`

  const order = {
    id: orderId,
    date: new Date().toISOString(),
    customer: {
      name: `${form.value.name.trim()} ${form.value.surname.trim()}`,
      firstName: form.value.name.trim(),
      surname: form.value.surname.trim(),
      fullName: `${form.value.name.trim()} ${form.value.surname.trim()}`,
      phone: form.value.phone.trim().replace(/\s+/g, ''),
      wilaya: form.value.wilaya,
      address: form.value.deliveryType === 'home' ? form.value.address.trim() : null,
      delivery: deliveryText
    },
    items: cartStore.items.map(item => ({
      id: item.id, name: item.name, price: item.price,
      color: item.color || 'أسود', size: item.size || 'M', quantity: item.quantity
    })),
    subtotal, shipping, total, status: 'Pending'
  }

  try {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
      if (!res.ok) throw new Error('API error')
      order.synced = true
    } catch {
      order.synced = false
    }

    // Save locally
    const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]')
    localOrders.push(order)
    localStorage.setItem('local_orders', JSON.stringify(localOrders))

    // Show success
    successData.value = {
      id: `#${orderId}`, name: order.customer.name, phone: order.customer.phone,
      wilaya: order.customer.wilaya, delivery: order.customer.delivery, total
    }
    cartStore.clear()
    orderSuccess.value = true
    form.value = { name: '', surname: '', phone: '', wilaya: '', deliveryType: 'home', address: '', office: '' }

    // Send notifications async
    sendAll(order).catch(() => {})
  } catch (err) {
    errorMsg.value = err.message || t('admin_error_generic')
    setTimeout(() => { errorMsg.value = '' }, 5000)
  } finally {
    submitting.value = false
  }
}

function closeSuccess() {
  orderSuccess.value = false
  successData.value = {}
  cartStore.close()
}
</script>

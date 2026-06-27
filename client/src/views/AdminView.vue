<template>
  <main class="admin-page">
    <!-- Login Screen -->
    <div v-if="!authenticated" class="admin-login">
      <div class="admin-login__box">
        <div class="section-eyebrow">aizo.dz</div>
        <h1 class="admin-login__title">{{ t('admin_login_title') }}</h1>
        <p class="admin-login__desc">{{ t('admin_login_desc') }}</p>
        <form @submit.prevent="login" class="admin-login__form" id="admin-login-form">
          <input
            type="password"
            v-model="password"
            :placeholder="t('admin_login_pwd_ph')"
            id="admin-password"
            class="admin-login__input"
            autofocus
          />
          <p v-if="loginError" class="admin-login__error">{{ t('admin_login_error') }}</p>
          <button type="submit" class="btn-primary admin-login__btn" id="admin-login-btn">
            {{ t('admin_login_btn') }}
          </button>
        </form>
        <RouterLink to="/" class="admin-back-link">{{ t('admin_back_store') }}</RouterLink>
      </div>
    </div>

    <!-- Dashboard -->
    <div v-else class="admin-dashboard">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="admin-sidebar__logo">aizo.dz</div>
        <div class="admin-sidebar__role">{{ t('admin_sidebar_role') }}</div>
        <div class="admin-sidebar__status">
          <span class="status-dot" :class="serverOnline ? 'online' : 'offline'"></span>
          {{ serverOnline ? t('admin_profile_status') : t('admin_server_disconnected') }}
        </div>

        <nav class="admin-nav">
          <button
            v-for="item in navItems"
            :key="item.key"
            class="admin-nav__item"
            :class="{ active: activeSection === item.key }"
            @click="activeSection = item.key"
          >{{ item.label }}</button>
        </nav>

        <div class="admin-sidebar__footer">
          <RouterLink to="/" class="admin-nav__item">{{ t('admin_back_store_sidebar') }}</RouterLink>
          <button class="admin-nav__item admin-logout" @click="logout">{{ t('admin_logout') }}</button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="admin-main">
        <!-- Stats -->
        <section v-if="activeSection === 'stats'" class="admin-section">
          <h2 class="admin-section__title">{{ t('admin_nav_stats') }}</h2>
          <div class="admin-stats-grid">
            <div class="stat-card stat-card--total">
              <div class="stat-card__label">إجمالي الطلبات</div>
              <div class="stat-card__value">{{ stats.totalOrders }}</div>
            </div>
            <div class="stat-card stat-card--pending" @click="activeSection = 'orders'; activeOrderFilter = 'pending'" style="cursor:pointer">
              <div class="stat-card__label">⏳ طلبات جديدة (انتظار)</div>
              <div class="stat-card__value">{{ stats.pending }}</div>
              <div class="stat-card__hint" v-if="stats.pending > 0">اضغط للمراجعة ←</div>
            </div>
            <div class="stat-card stat-card--confirmed">
              <div class="stat-card__label">✅ طلبات مؤكدة</div>
              <div class="stat-card__value">{{ stats.confirmed }}</div>
            </div>
            <div class="stat-card stat-card--delivered">
              <div class="stat-card__label">{{ t('admin_delivered_total') }}</div>
              <div class="stat-card__value">{{ stats.delivered }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__label">{{ t('admin_products_active') }}</div>
              <div class="stat-card__value">{{ productsStore.products.length }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__label">{{ t('admin_leads_total') }}</div>
              <div class="stat-card__value">{{ stats.leads }}</div>
            </div>
          </div>

          <!-- Recent Orders -->
          <h3 class="admin-subsection__title">{{ t('admin_recent_orders') }}</h3>
          <div v-if="orders.length === 0" class="admin-empty">{{ t('admin_orders_recent_empty') }}</div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>{{ t('admin_col_order_id') }}</th>
                  <th>{{ t('admin_col_date') }}</th>
                  <th>{{ t('admin_col_customer') }}</th>
                  <th>{{ t('admin_col_phone') }}</th>
                  <th>{{ t('admin_col_wilaya') }}</th>
                  <th>{{ t('admin_col_total') }}</th>
                  <th>{{ t('admin_col_status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders.slice(0, 10)" :key="order._id || order.id">
                  <td>#{{ order.id || order._id }}</td>
                  <td>{{ formatDate(order.date || order.createdAt) }}</td>
                  <td>{{ order.customer?.name || order.customer?.fullName || '—' }}</td>
                  <td>{{ order.customer?.phone || '—' }}</td>
                  <td>{{ order.customer?.wilaya || '—' }}</td>
                  <td>{{ (order.total || 0).toLocaleString() }} DZD</td>
                  <td><span :class="`status-badge status-${normalizeStatus(order.status)}`">{{ order.status || '—' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Orders -->
        <section v-if="activeSection === 'orders'" class="admin-section">
          <div class="admin-section-header">
            <h2 class="admin-section__title">{{ t('admin_nav_orders') }}</h2>
            <div class="admin-section-actions">
              <span class="orders-count-badge" v-if="pendingOrders.length > 0">{{ pendingOrders.length }} طلب جديد</span>
              <button class="admin-btn admin-btn--refresh" @click="refreshData">🔄 تحديث</button>
            </div>
          </div>

          <!-- Filter Tabs -->
          <div class="order-filter-tabs">
            <button
              v-for="f in orderFilters"
              :key="f.key"
              class="filter-tab"
              :class="{ active: activeOrderFilter === f.key }"
              @click="activeOrderFilter = f.key"
            >{{ f.label }} <span class="filter-count">{{ f.count }}</span></button>
          </div>

          <div v-if="filteredOrders.length === 0" class="admin-empty">لا توجد طلبات في هذا القسم</div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>التاريخ</th>
                  <th>العميل</th>
                  <th>الهاتف</th>
                  <th>الولاية</th>
                  <th>طريقة الاستلام</th>
                  <th>المنتجات</th>
                  <th>الإجمالي</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order._id || order.id" :class="{ 'row-pending': isPending(order.status), 'row-custom': order.customOrder }">
                  <td>
                    <span class="order-id">#{{ order.id || order._id }}</span>
                    <span v-if="order.customOrder" class="custom-badge">🎨</span>
                  </td>
                  <td>{{ formatDate(order.date || order.createdAt) }}</td>
                  <td>{{ order.customer?.name || order.customer?.fullName || '—' }}</td>
                  <td>{{ order.customer?.phone || '—' }}</td>
                  <td>{{ order.customer?.wilaya || '—' }}</td>
                  <td>{{ formatDelivery(order.customer?.delivery) }}</td>
                  <td>
                    <span v-for="(item, i) in (order.items || [])"
                      :key="i"
                      class="item-chip"
                    >{{ item.name }} ({{ item.size || 'M' }}) ×{{ item.quantity || 1 }}</span>
                  </td>
                  <td><strong>{{ (order.total || 0).toLocaleString() }} DZD</strong></td>
                  <td>
                    <select
                      :value="order.status"
                      @change="updateOrderStatus(order, $event.target.value)"
                      class="status-select"
                      :class="`status-select--${normalizeStatus(order.status)}`"
                    >
                      <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                    </select>
                  </td>
                  <td>
                    <button class="admin-btn admin-btn--danger" @click="deleteOrder(order)">🗑️ حذف</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Products -->
        <section v-if="activeSection === 'products'" class="admin-section">
          <h2 class="admin-section__title">{{ t('admin_nav_products') }}</h2>

          <!-- Add/Edit Form -->
          <div class="admin-form-card" id="product-form">
            <h3>{{ editingProduct ? t('admin_form_btn_update') : t('admin_form_add_title') }}</h3>
            <div class="admin-form-grid">
              <div class="form-group">
                <label>{{ t('admin_form_prod_name') }}</label>
                <input v-model="productForm.name" :placeholder="t('admin_form_prod_name_ph')" class="admin-input" />
              </div>
              <div class="form-group">
                <label>{{ t('admin_form_prod_sub') }}</label>
                <input v-model="productForm.sub" :placeholder="t('admin_form_prod_sub_ph')" class="admin-input" />
              </div>
              <div class="form-group">
                <label>{{ t('admin_form_prod_price') }}</label>
                <input type="number" v-model="productForm.price" class="admin-input" />
              </div>
              <div class="form-group">
                <label>{{ t('admin_form_prod_img') }}</label>
                <input v-model="productForm.img" class="admin-input" placeholder="https://..." />
              </div>
              <div class="form-group">
                <label>{{ t('admin_col_category') }}</label>
                <select v-model="productForm.category" class="admin-input">
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Shorts">Shorts</option>
                  <option value="T-shirt">T-shirt</option>
                  <option value="Jorts">Jorts</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ t('admin_form_prod_badge') }}</label>
                <select v-model="productForm.badge" class="admin-input">
                  <option :value="null">{{ t('admin_form_badge_none') }}</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ t('admin_form_prod_stars') }}</label>
                <input type="number" v-model="productForm.stars" min="1" max="5" class="admin-input" />
              </div>
              <div class="form-group">
                <label>{{ t('admin_form_prod_reviews') }}</label>
                <input type="number" v-model="productForm.reviews" class="admin-input" />
              </div>
              <div class="form-group form-group--full">
                <label>{{ t('admin_form_prod_sizes') }}</label>
                <div class="size-checkboxes">
                  <label v-for="sz in ['XS','S','M','L','XL','XXL']" :key="sz" class="checkbox-label">
                    <input type="checkbox" :value="sz" v-model="productForm.sizes" /> {{ sz }}
                  </label>
                </div>
              </div>
              <div class="form-group form-group--full">
                <label>{{ t('admin_form_prod_colors') }}</label>
                <input v-model="productForm.colorsInput" :placeholder="t('admin_form_prod_colors_ph')" class="admin-input" />
              </div>
            </div>
            <div class="admin-form-actions">
              <button class="btn-primary" @click="saveProduct" id="btn-save-product" :disabled="savingProduct">
                <span v-if="savingProduct">⏳ جاري الحفظ...</span>
                <span v-else>{{ editingProduct ? t('admin_form_btn_update') : t('admin_form_btn_save') }}</span>
              </button>
              <button class="btn-secondary-outline" @click="resetForm" :disabled="savingProduct">{{ t('admin_form_btn_reset') }}</button>
            </div>
            <div v-if="saveMessage.text" class="save-message" :class="'save-message--' + saveMessage.type">
              {{ saveMessage.text }}
            </div>
          </div>


          <!-- Products List -->
          <div v-if="productsStore.products.length === 0" class="admin-empty">{{ t('admin_products_empty') }}</div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>{{ t('admin_col_image') }}</th>
                  <th>{{ t('admin_col_name') }}</th>
                  <th>{{ t('admin_col_category') }}</th>
                  <th>{{ t('admin_col_price') }}</th>
                  <th>{{ t('admin_col_badge') }}</th>
                  <th>{{ t('admin_col_actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in productsStore.products" :key="product.id">
                  <td><img :src="product.img" :alt="product.name" class="admin-product-thumb" /></td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.category }}</td>
                  <td>{{ product.price?.toLocaleString() }} DZD</td>
                  <td>{{ product.badge || '—' }}</td>
                  <td>
                    <div class="admin-action-btns">
                      <button class="admin-btn admin-btn--edit" @click="editProduct(product)">{{ t('admin_col_actions_edit') }}</button>
                      <button class="admin-btn admin-btn--danger" @click="deleteProduct(product)">{{ t('admin_col_actions_delete') }}</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Leads -->
        <section v-if="activeSection === 'leads'" class="admin-section">
          <h2 class="admin-section__title">{{ t('admin_nav_leads') }}</h2>
          <div v-if="leads.length === 0" class="admin-empty">{{ t('admin_leads_empty') }}</div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>{{ t('admin_col_date') }}</th>
                  <th>{{ t('admin_col_actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lead in leads" :key="lead._id || lead.email">
                  <td>{{ lead.email }}</td>
                  <td>{{ formatDate(lead.date) }}</td>
                  <td>
                    <button class="admin-btn admin-btn--danger" @click="deleteLead(lead)">{{ t('admin_col_actions_delete') }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLangStore } from '@/stores/lang.js'
import { useProductsStore } from '@/stores/products.js'

const langStore = useLangStore()
const productsStore = useProductsStore()
const t = (key) => langStore.tr(key)

// Auth
const authenticated = ref(false)
const password = ref('')
const loginError = ref(false)
const ADMIN_PASSWORD = 'aizo2026'

function login() {
  if (password.value === ADMIN_PASSWORD) {
    authenticated.value = true
    loginError.value = false
    sessionStorage.setItem('aizo_admin', '1')
  } else {
    loginError.value = true
  }
}

function logout() {
  authenticated.value = false
  sessionStorage.removeItem('aizo_admin')
}

// Navigation
const activeSection = ref('stats')
const navItems = computed(() => [
  { key: 'stats', label: t('admin_nav_stats') },
  { key: 'orders', label: t('admin_nav_orders') },
  { key: 'products', label: t('admin_nav_products') },
  { key: 'leads', label: t('admin_nav_leads') },
])

// Server status
const serverOnline = ref(false)

// Data
const orders = ref([])
const leads = ref([])
const activeOrderFilter = ref('all')

// Status options matching actual DB values
const statusOptions = [
  { value: 'Pending', label: '⏳ قيد الانتظار' },
  { value: 'Confirmed', label: '✅ مؤكد' },
  { value: 'confirmé', label: '✅ مؤكد (FR)' },
  { value: 'livré', label: '🚚 تم التسليم' },
  { value: 'Delivered', label: '✅ تم التسليم' },
  { value: 'Returned', label: '↩️ مُرجع' },
  { value: 'retourné', label: '↩️ مُرجع (FR)' },
  { value: 'Cancelled', label: '❌ ملغي' },
  { value: 'annulé', label: '❌ ملغي (FR)' },
]

function normalizeStatus(status) {
  if (!status) return 'pending'
  const s = status.toLowerCase()
  if (s === 'pending' || s === 'en attente') return 'pending'
  if (s === 'confirmed' || s === 'confirmé') return 'confirmed'
  if (s === 'delivered' || s === 'livré') return 'delivered'
  if (s === 'returned' || s === 'retourné') return 'returned'
  if (s === 'cancelled' || s === 'annulé') return 'cancelled'
  return s.replace(/[^a-z]/g, '')
}

function isPending(status) {
  if (!status) return true
  return ['pending', 'en attente'].includes(status.toLowerCase())
}

function formatDelivery(delivery) {
  if (!delivery) return '—'
  if (delivery.toLowerCase().includes('office') || delivery.includes('مكتب') || delivery.includes('STOP')) return '🏢 مكتب'
  if (delivery.toLowerCase().includes('home') || delivery.includes('منزل') || delivery.includes('domicile') || delivery.includes('A DOM')) return '🏠 منزل'
  if (delivery === 'Tract') return '🎨 طلب مخصص'
  return delivery.slice(0, 30) + (delivery.length > 30 ? '...' : '')
}

const pendingOrders = computed(() => orders.value.filter(o => isPending(o.status)))

const orderFilters = computed(() => [
  { key: 'all', label: 'الكل', count: orders.value.length },
  { key: 'pending', label: '⏳ انتظار', count: pendingOrders.value.length },
  { key: 'confirmed', label: '✅ مؤكد', count: orders.value.filter(o => normalizeStatus(o.status) === 'confirmed').length },
  { key: 'delivered', label: '🚚 مسلّم', count: orders.value.filter(o => normalizeStatus(o.status) === 'delivered').length },
  { key: 'returned', label: '↩️ مُرجع', count: orders.value.filter(o => normalizeStatus(o.status) === 'returned').length },
  { key: 'custom', label: '🎨 مخصص', count: orders.value.filter(o => o.customOrder).length },
])

const filteredOrders = computed(() => {
  if (activeOrderFilter.value === 'all') return [...orders.value].reverse()
  if (activeOrderFilter.value === 'custom') return [...orders.value].filter(o => o.customOrder).reverse()
  return [...orders.value].filter(o => normalizeStatus(o.status) === activeOrderFilter.value).reverse()
})

const stats = computed(() => ({
  totalOrders: orders.value.length,
  pending: pendingOrders.value.length,
  delivered: orders.value.filter(o => normalizeStatus(o.status) === 'delivered').length,
  confirmed: orders.value.filter(o => normalizeStatus(o.status) === 'confirmed').length,
  leads: leads.value.length,
}))

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-DZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function loadOrders() {
  try {
    const apiBase = window.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || ''
    const res = await fetch(`${apiBase}/api/orders`, { signal: AbortSignal?.timeout?.(8000) })
    if (res.ok) {
      const data = await res.json()
      orders.value = Array.isArray(data) ? data : []
      serverOnline.value = true
    } else {
      console.warn('API orders returned error:', res.status)
      serverOnline.value = false
    }
  } catch (err) {
    console.warn('Failed to load orders from server, using localStorage fallback:', err.message)
    serverOnline.value = false
    // Merge server orders + local pending orders
    const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]')
    orders.value = localOrders
  }
}

async function refreshData() {
  await loadOrders()
  await loadLeads()
}

async function loadLeads() {
  try {
    const res = await fetch('/api/leads', { signal: AbortSignal?.timeout?.(5000) })
    if (res.ok) leads.value = await res.json()
  } catch {
    leads.value = JSON.parse(localStorage.getItem('local_leads') || '[]')
  }
}

async function updateOrderStatus(order, status) {
  const id = order._id || order.id
  try {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
  } catch {}
  order.status = status
}

async function deleteOrder(order) {
  const id = order._id || order.id
  if (!confirm(t('admin_confirm_delete_order').replace('{id}', id))) return
  try {
    await fetch(`/api/orders/${id}`, { method: 'DELETE' })
  } catch {}
  orders.value = orders.value.filter(o => (o._id || o.id) !== id)
}

async function deleteLead(lead) {
  if (!confirm(t('admin_confirm_delete_lead').replace('{email}', lead.email))) return
  const id = lead._id || lead.email
  try {
    await fetch(`/api/leads/${id}`, { method: 'DELETE' })
  } catch {}
  leads.value = leads.value.filter(l => (l._id || l.email) !== id)
}

// Product form
const editingProduct = ref(null)
const productForm = ref({
  name: '', sub: '', price: '', img: '', category: 'Jeans',
  badge: null, stars: 5, reviews: 0, sizes: ['M', 'L', 'XL'], colorsInput: 'أسود, أبيض'
})

function resetForm() {
  editingProduct.value = null
  productForm.value = { name: '', sub: '', price: '', img: '', category: 'Jeans', badge: null, stars: 5, reviews: 0, sizes: ['M', 'L', 'XL'], colorsInput: 'أسود, أبيض' }
}

function editProduct(product) {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    sub: product.sub,
    price: product.price,
    img: product.img,
    category: product.category,
    badge: product.badge || null,
    stars: product.stars,
    reviews: product.reviews,
    sizes: [...(product.sizes || [])],
    colorsInput: (product.colors || []).join(', ')
  }
  document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' })
}

const savingProduct = ref(false)
const saveMessage = ref({ text: '', type: '' })

async function saveProduct() {
  // Form validation
  if (!productForm.value.name || !productForm.value.name.trim()) {
    saveMessage.value = { text: t('admin_form_btn_save') + ' — ⚠️ الاسم مطلوب / Name is required', type: 'error' }
    setTimeout(() => saveMessage.value = { text: '', type: '' }, 4000)
    return
  }
  if (!productForm.value.price || isNaN(parseFloat(productForm.value.price)) || parseFloat(productForm.value.price) <= 0) {
    saveMessage.value = { text: '⚠️ السعر مطلوب / Price is required', type: 'error' }
    setTimeout(() => saveMessage.value = { text: '', type: '' }, 4000)
    return
  }

  savingProduct.value = true
  saveMessage.value = { text: '', type: '' }

  const colors = productForm.value.colorsInput.split(',').map(c => c.trim()).filter(Boolean)
  const data = {
    ...productForm.value,
    price: parseFloat(productForm.value.price),
    colors,
    badgeType: productForm.value.badge?.toLowerCase() || null,
  }
  delete data.colorsInput

  let success = false

  if (editingProduct.value) {
    // Update existing product
    const id = editingProduct.value._id || editingProduct.value.id
    try {
      const res = await fetch(`/api/custom-products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        success = true
      } else {
        console.error('Failed to update product:', res.status, await res.text().catch(() => ''))
      }
    } catch (err) {
      console.error('Network error updating product:', err)
    }
  } else {
    // Add new product
    data.id = Date.now()
    try {
      const res = await fetch('/api/custom-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        success = true
      } else {
        console.error('Failed to save product:', res.status, await res.text().catch(() => ''))
      }
    } catch (err) {
      console.error('Network error saving product, using localStorage fallback:', err)
      // Fallback to localStorage
      const local = JSON.parse(localStorage.getItem('custom_products') || '[]')
      local.push(data)
      localStorage.setItem('custom_products', JSON.stringify(local))
      success = true // saved locally at least
    }
  }

  await productsStore.load(true)

  savingProduct.value = false

  if (success) {
    saveMessage.value = { text: '✅ ' + (editingProduct.value ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح!'), type: 'success' }
    resetForm()
  } else {
    saveMessage.value = { text: '❌ فشل في حفظ المنتج. تحقق من اتصال السيرفر', type: 'error' }
  }
  setTimeout(() => saveMessage.value = { text: '', type: '' }, 5000)
}

async function deleteProduct(product) {
  if (!confirm(t('admin_confirm_delete_product'))) return
  const id = product._id || product.id
  try {
    await fetch(`/api/custom-products/${id}`, { method: 'DELETE' })
  } catch {
    const local = JSON.parse(localStorage.getItem('custom_products') || '[]')
    localStorage.setItem('custom_products', JSON.stringify(local.filter(p => p.id !== id)))
  }
  await productsStore.load(true)
}

onMounted(async () => {
  if (sessionStorage.getItem('aizo_admin') === '1') authenticated.value = true
  await productsStore.load()
  await loadOrders()
  await loadLeads()

  // Auto-refresh every 30 seconds to catch new orders
  setInterval(() => {
    if (authenticated.value) {
      loadOrders()
    }
  }, 30000)
})
</script>

<style scoped>
.admin-page { min-height: 100vh; background: var(--color-bg); }

/* Login */
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.admin-login__box {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-login__title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 400;
  margin: 0;
}

.admin-login__desc { font-size: 0.875rem; color: var(--color-text-muted); margin: 0; }

.admin-login__form { display: flex; flex-direction: column; gap: 1rem; }

.admin-login__input {
  padding: 0.875rem 1rem;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  width: 100%;
  box-sizing: border-box;
}

.admin-login__input:focus { outline: none; border-color: var(--color-text); }

.admin-login__error { color: #e53e3e; font-size: 0.8125rem; margin: 0; }

.admin-login__btn { width: 100%; padding: 1rem; }

.admin-back-link { font-size: 0.8125rem; color: var(--color-text-muted); text-decoration: none; text-align: center; }
.admin-back-link:hover { color: var(--color-text); }

/* Dashboard */
.admin-dashboard { display: flex; min-height: 100vh; }

.admin-sidebar {
  width: 260px;
  min-width: 220px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.admin-sidebar__logo { font-family: var(--font-display); font-size: 1.25rem; letter-spacing: 0.05em; }
.admin-sidebar__role { font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.1em; }

.admin-sidebar__status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-dot.online { background: #48bb78; }
.status-dot.offline { background: #fc8181; }

.admin-nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }

.admin-nav__item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-family: var(--font-body);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  text-decoration: none;
}

.admin-nav__item:hover { background: var(--color-bg); color: var(--color-text); }
.admin-nav__item.active { background: var(--color-bg); color: var(--color-text); font-weight: 600; }
.admin-logout { color: #fc8181 !important; }

.admin-sidebar__footer {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
}

.admin-main { flex: 1; padding: 2rem; overflow-y: auto; }

.admin-section { display: flex; flex-direction: column; gap: 1.5rem; }

.admin-section__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.admin-subsection__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.5rem 0 0;
}

/* Stats grid */
.admin-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  border-radius: 4px;
}

.stat-card__label { font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
.stat-card__value { font-size: 2rem; font-weight: 700; color: var(--color-text); }

/* Table */
.admin-table-wrap { overflow-x: auto; border: 1px solid var(--color-border); border-radius: 4px; }

.admin-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
.admin-table th { background: var(--color-surface); padding: 0.75rem 1rem; text-align: left; font-weight: 600; color: var(--color-text-muted); border-bottom: 1px solid var(--color-border); white-space: nowrap; }
.admin-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); color: var(--color-text); }
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: var(--color-surface); }

.admin-product-thumb { width: 48px; height: 48px; object-fit: cover; border-radius: 2px; }

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-pending { background: #fef3c7; color: #92400e; }
.status-confirmed { background: #dbeafe; color: #1e40af; }
.status-ready { background: #d1fae5; color: #065f46; }
.status-delivery { background: #ede9fe; color: #5b21b6; }
.status-delivered { background: #d1fae5; color: #065f46; }
.status-returned { background: #fee2e2; color: #991b1b; }
.status-cancelled { background: #f3f4f6; color: #6b7280; }

.status-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.75rem;
  font-family: var(--font-body);
}

.admin-btn {
  padding: 0.35rem 0.75rem;
  border: none;
  border-radius: 2px;
  font-size: 0.75rem;
  font-family: var(--font-body);
  cursor: pointer;
  transition: opacity 0.2s;
}
.admin-btn:hover { opacity: 0.8; }
.admin-btn--edit { background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text); }
.admin-btn--danger { background: #fee2e2; color: #991b1b; }

.admin-action-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; }

/* Form */
.admin-form-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 2rem;
  border-radius: 4px;
}

.admin-form-card h3 { margin: 0 0 1.5rem; font-size: 1rem; font-weight: 600; }

.admin-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group--full { grid-column: 1 / -1; }

.form-group label { font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

.admin-input {
  padding: 0.625rem 0.875rem;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.875rem;
  border-radius: 2px;
  width: 100%;
  box-sizing: border-box;
}

.admin-input:focus { outline: none; border-color: var(--color-text); }

.size-checkboxes { display: flex; gap: 1rem; flex-wrap: wrap; }
.checkbox-label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.875rem; cursor: pointer; }

.admin-form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }

.save-message {
  margin-top: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}
.save-message--success {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}
.save-message--error {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}


.btn-secondary-outline {
  padding: 0.75rem 1.5rem;
  border: 1.5px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 0.8125rem;
  font-family: var(--font-body);
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
}
.btn-secondary-outline:hover { border-color: var(--color-text); }

.admin-empty {
  padding: 3rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  border: 1px dashed var(--color-border);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .admin-dashboard { flex-direction: column; }
  .admin-sidebar { width: 100%; height: auto; position: static; }
  .admin-nav { flex-direction: row; flex-wrap: wrap; }
}

/* Stat card variants */
.stat-card--pending { border-left: 3px solid #f59e0b; }
.stat-card--pending .stat-card__value { color: #92400e; }
.stat-card--pending:hover { background: #fffbeb; }
.stat-card--confirmed { border-left: 3px solid #3b82f6; }
.stat-card--confirmed .stat-card__value { color: #1e40af; }
.stat-card--delivered { border-left: 3px solid #10b981; }
.stat-card--delivered .stat-card__value { color: #065f46; }
.stat-card__hint { font-size: 0.7rem; color: #f59e0b; margin-top: 0.25rem; font-weight: 600; }

/* Section header with actions */
.admin-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}
.admin-section-header .admin-section__title { border-bottom: none; padding-bottom: 0; }
.admin-section-actions { display: flex; align-items: center; gap: 0.75rem; }

/* Orders count badge */
.orders-count-badge {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #f59e0b;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Refresh button */
.admin-btn--refresh {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.4rem 0.875rem;
}
.admin-btn--refresh:hover { border-color: var(--color-text); }

/* Filter tabs */
.order-filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.5rem 0;
}
.filter-tab {
  padding: 0.35rem 0.875rem;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-family: var(--font-body);
  cursor: pointer;
  border-radius: 100px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.filter-tab:hover { border-color: var(--color-text); color: var(--color-text); }
.filter-tab.active { background: var(--color-text); color: var(--color-bg); border-color: var(--color-text); }
.filter-count {
  background: rgba(0,0,0,0.12);
  padding: 0.05rem 0.4rem;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 700;
}
.filter-tab.active .filter-count { background: rgba(255,255,255,0.2); }

/* Order row highlighting */
.row-pending td { background: #fffbeb !important; }
.row-pending:hover td { background: #fef3c7 !important; }
.row-custom td { border-right: 3px solid #8b5cf6; }

/* Order ID and custom badge */
.order-id { font-family: monospace; font-weight: 600; font-size: 0.85rem; }
.custom-badge {
  display: inline-block;
  margin-right: 0.35rem;
  font-size: 0.7rem;
  background: #ede9fe;
  color: #5b21b6;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-weight: 700;
}

/* Item chips */
.item-chip {
  display: inline-block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.72rem;
  margin: 1px 2px;
  white-space: nowrap;
}

/* Status select color variants */
.status-select--pending { border-color: #f59e0b !important; color: #92400e !important; }
.status-select--confirmed { border-color: #3b82f6 !important; color: #1e40af !important; }
.status-select--delivered { border-color: #10b981 !important; color: #065f46 !important; }
.status-select--returned { border-color: #ef4444 !important; color: #991b1b !important; }
.status-select--cancelled { border-color: #9ca3af !important; color: #6b7280 !important; }

</style>

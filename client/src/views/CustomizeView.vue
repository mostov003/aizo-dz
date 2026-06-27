<template>
  <main class="customize-page">
    <div class="customize-hero">
      <div class="section-eyebrow">aizo.dz</div>
      <h1 class="customize-hero__title">{{ t('co_title') }}</h1>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator" aria-label="Steps">
      <div
        v-for="(step, i) in steps"
        :key="i"
        class="step-item"
        :class="{ active: currentStep === i, completed: currentStep > i }"
      >
        <div class="step-circle">{{ i + 1 }}</div>
        <span>{{ step }}</span>
      </div>
    </div>

    <div class="customize-container">
      <!-- STEP 0: Design Upload -->
      <section v-if="currentStep === 0" class="customize-step" id="step-design">
        <h2 class="customize-step__title">{{ t('co_upload_title') }}</h2>

        <!-- Garment Selector -->
        <div class="garment-selector">
          <div class="garment-preview">
            <img
              src="https://i.pinimg.com/736x/2b/5d/60/2b5d60ac344515aada335e3ce17938aa.jpg"
              alt="Garment preview"
              class="garment-img"
            />
            <!-- Placement zones -->
            <div
              v-for="zone in placementZones"
              :key="zone.key"
              class="placement-zone"
              :class="{ active: activeZone === zone.key, 'has-design': designs[zone.key] }"
              :style="zone.style"
              @click="activeZone = zone.key"
              :title="t(zone.labelKey)"
            >
              <span v-if="!designs[zone.key]">+</span>
              <img v-else :src="designs[zone.key]" :alt="t(zone.labelKey)" class="zone-design-thumb" />
            </div>
          </div>

          <div class="zone-controls">
            <p class="zone-label">{{ t('co_active_designs') }}</p>
            <div class="zone-list">
              <div
                v-for="zone in placementZones"
                :key="zone.key"
                class="zone-list-item"
                :class="{ active: activeZone === zone.key }"
                @click="activeZone = zone.key"
              >
                <span class="zone-dot" :class="{ filled: !!designs[zone.key] }"></span>
                {{ t(zone.labelKey) }}
                <button v-if="designs[zone.key]" class="zone-delete-btn" @click.stop="removeDesign(zone.key)">×</button>
              </div>
            </div>

            <!-- Upload for active zone -->
            <div v-if="activeZone" class="upload-area" @dragover.prevent @drop.prevent="handleDrop($event)">
              <input
                type="file"
                :id="`upload-${activeZone}`"
                accept="image/png,image/jpeg,image/svg+xml"
                @change="handleFileUpload($event)"
                style="display:none"
              />
              <label :for="`upload-${activeZone}`" class="upload-label">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="32" height="32"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
                <p>{{ t('co_drag_drop') }}</p>
                <span>{{ t('co_click_browse') }}</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 1: Options -->
      <section v-if="currentStep === 1" class="customize-step" id="step-options">
        <h2 class="customize-step__title">{{ t('co_step_options') }}</h2>

        <div class="options-grid">
          <div class="option-group">
            <label class="option-label">{{ t('co_garment_type') }}</label>
            <div class="option-chips">
              <button
                v-for="type in ['Hoodie', 'T-Shirt', 'Jacket', 'Sweatshirt']"
                :key="type"
                class="option-chip"
                :class="{ active: garmentType === type }"
                @click="garmentType = type"
              >{{ type }}</button>
            </div>
          </div>

          <div class="option-group">
            <label class="option-label">{{ t('co_garment_color') }}</label>
            <div class="option-chips">
              <button
                v-for="color in garmentColors"
                :key="color.name"
                class="color-chip"
                :class="{ active: garmentColor === color.name }"
                :style="{ background: color.hex }"
                :title="color.name"
                @click="garmentColor = color.name"
              ></button>
            </div>
          </div>

          <div class="option-group">
            <label class="option-label">{{ t('co_size') }}</label>
            <div class="option-chips">
              <button
                v-for="sz in ['XS','S','M','L','XL','XXL']"
                :key="sz"
                class="option-chip"
                :class="{ active: garmentSize === sz }"
                @click="garmentSize = sz"
              >{{ sz }}</button>
            </div>
          </div>

          <div class="option-group">
            <label class="option-label">{{ t('co_service_type') }}</label>
            <div class="option-chips">
              <button
                class="option-chip"
                :class="{ active: serviceType === 'embroidery' }"
                @click="serviceType = 'embroidery'"
              >{{ t('co_embroidery') }} ✓</button>
              <button class="option-chip disabled" disabled>
                {{ t('co_print') }} — {{ t('co_coming_soon') }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 2: Customer Info -->
      <section v-if="currentStep === 2" class="customize-step" id="step-info">
        <h2 class="customize-step__title">{{ t('co_delivery_info_title') }}</h2>

        <div class="info-form">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('co_name') }}</label>
              <input v-model="form.name" :placeholder="t('co_name_ph')" class="co-input" id="co-name" />
            </div>
            <div class="form-group">
              <label>{{ t('co_surname') }}</label>
              <input v-model="form.surname" :placeholder="t('co_surname_ph')" class="co-input" id="co-surname" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('co_email') }}</label>
              <input type="email" v-model="form.email" :placeholder="t('co_email_ph')" class="co-input" id="co-email" />
            </div>
            <div class="form-group">
              <label>{{ t('co_phone') }}</label>
              <input type="tel" v-model="form.phone" :placeholder="t('co_phone_ph')" class="co-input" id="co-phone" />
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('co_province') }}</label>
            <input v-model="form.province" class="co-input" id="co-province" placeholder="Ex: Alger" />
          </div>
          <div class="form-group">
            <label>{{ t('co_notes') }}</label>
            <textarea v-model="form.notes" :placeholder="t('co_notes_ph')" class="co-input co-textarea" id="co-notes" rows="3"></textarea>
          </div>
        </div>
      </section>

      <!-- STEP 3: Summary -->
      <section v-if="currentStep === 3" class="customize-step" id="step-summary">
        <h2 class="customize-step__title">{{ t('co_order_summary') }}</h2>

        <div v-if="!submitted" class="summary-card">
          <div class="summary-row">
            <span class="summary-label">{{ t('co_garment_type') }}</span>
            <span>{{ garmentType }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('co_garment_color') }}</span>
            <span>{{ garmentColor }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('co_size') }}</span>
            <span>{{ garmentSize }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('co_service_type') }}</span>
            <span>{{ t('co_embroidery') }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('co_placements') }}</span>
            <span>{{ activePlacements.join(', ') || '—' }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('co_customer') }}</span>
            <span>{{ form.name }} {{ form.surname }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('co_phone') }}</span>
            <span>{{ form.phone }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t('co_province') }}</span>
            <span>{{ form.province }}</span>
          </div>
          <p class="summary-desc">{{ t('co_summary_desc') }}</p>

          <button class="btn-primary btn-confirm" @click="submitOrder" id="btn-confirm-custom">
            {{ t('co_confirm') }}
          </button>
        </div>

        <!-- Success -->
        <div v-else class="summary-success">
          <div class="success-icon">✓</div>
          <h3>{{ t('co_success_title') }}</h3>
          <p>{{ t('co_success_desc') }}</p>
          <RouterLink to="/" class="btn-primary">{{ t('co_success_close') }}</RouterLink>
        </div>
      </section>

      <!-- Navigation -->
      <div v-if="!submitted" class="step-nav">
        <button
          v-if="currentStep > 0"
          class="btn-step-nav btn-prev"
          @click="currentStep--"
        >{{ t('co_prev') }}</button>
        <button
          v-if="currentStep < steps.length - 1"
          class="btn-step-nav btn-next btn-primary"
          @click="currentStep++"
          id="btn-next-step"
        >{{ t('co_next') }}</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLangStore } from '@/stores/lang.js'

const langStore = useLangStore()
const t = (key) => langStore.tr(key)

const currentStep = ref(0)
const submitted = ref(false)

const steps = computed(() => [
  t('co_step_design'),
  t('co_step_options'),
  t('co_step_info'),
  t('co_step_summary'),
])

// Design zones
const activeZone = ref('center')
const designs = ref({})

const placementZones = [
  { key: 'center', labelKey: 'co_area_center', style: 'top:30%;left:40%;width:20%;height:15%;' },
  { key: 'chest_left', labelKey: 'co_area_chest_left', style: 'top:28%;left:25%;width:12%;height:10%;' },
  { key: 'chest_right', labelKey: 'co_area_chest_right', style: 'top:28%;left:63%;width:12%;height:10%;' },
  { key: 'back', labelKey: 'co_area_back', style: 'top:42%;left:35%;width:30%;height:20%;opacity:0.5;' },
]

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file || !activeZone.value) return
  const reader = new FileReader()
  reader.onload = (e) => { designs.value = { ...designs.value, [activeZone.value]: e.target.result } }
  reader.readAsDataURL(file)
}

function handleDrop(event) {
  const file = event.dataTransfer.files[0]
  if (!file || !activeZone.value) return
  const reader = new FileReader()
  reader.onload = (e) => { designs.value = { ...designs.value, [activeZone.value]: e.target.result } }
  reader.readAsDataURL(file)
}

function removeDesign(zoneKey) {
  const d = { ...designs.value }
  delete d[zoneKey]
  designs.value = d
}

const activePlacements = computed(() =>
  placementZones.filter(z => designs.value[z.key]).map(z => t(z.labelKey))
)

// Options
const garmentType = ref('Hoodie')
const garmentColor = ref('Noir')
const garmentSize = ref('M')
const serviceType = ref('embroidery')

const garmentColors = [
  { name: 'Noir', hex: '#1a1a1a' },
  { name: 'Blanc', hex: '#f5f5f5' },
  { name: 'Gris', hex: '#6b7280' },
  { name: 'Marine', hex: '#1e3a5f' },
  { name: 'Bordeaux', hex: '#7f1d1d' },
]

// Form
const form = ref({ name: '', surname: '', email: '', phone: '', province: '', notes: '' })

async function submitOrder() {
  // Validate form
  if (!form.value.name || !form.value.surname || !form.value.email || !form.value.phone || !form.value.province) {
    alert('يرجى ملء جميع الحقول المطلوبة')
    return
  }
  
  if (Object.keys(designs.value).length === 0) {
    alert('يرجى تحميل تصميم واحد على الأقل')
    return
  }

  // Build complete order object structure
  const orderId = 'AZ-' + Math.floor(100000 + Math.random() * 900000)
  
  const orderPayload = {
    id: orderId,
    date: new Date().toISOString(),
    items: [{
      id: 1,
      name: garmentType.value,
      price: 2500, // Default price for custom orders
      color: garmentColor.value,
      size: garmentSize.value,
      quantity: 1
    }],
    total: 2500,
    status: 'Pending',
    customer: {
      name: form.value.name,
      firstName: form.value.name,
      surname: form.value.surname,
      fullName: `${form.value.name} ${form.value.surname}`,
      email: form.value.email,
      phone: form.value.phone,
      wilaya: form.value.province,
      address: form.value.province,
      delivery: 'Tract'
    },
    customOrder: {
      color: garmentColor.value,
      size: garmentSize.value,
      serviceType: serviceType.value,
      layers: Object.entries(designs.value).map(([area, img], idx) => ({
        area: area,
        left: 0,
        top: 0,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
        img: img
      })),
      customer: {
        name: form.value.name,
        surname: form.value.surname,
        email: form.value.email,
        phone: form.value.phone,
        province: form.value.province,
        notes: form.value.notes
      }
    }
  }

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })
    
    if (response.ok) {
      submitted.value = true
      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        window.location.href = '/admin.html#orders'
      }, 3000)
    } else {
      throw new Error('Server error: ' + response.status)
    }
  } catch (error) {
    console.error('Order submission error:', error)
    // Save to localStorage as fallback
    const local = JSON.parse(localStorage.getItem('local_orders') || '[]')
    local.push(orderPayload)
    localStorage.setItem('local_orders', JSON.stringify(local))
    
    submitted.value = true
    // Still redirect even if offline
    setTimeout(() => {
      window.location.href = '/admin.html#orders'
    }, 3000)
  }
}
</script>

<style scoped>
.customize-page { min-height: 100vh; }

.customize-hero {
  padding: 5rem var(--space-side) 2rem;
  text-align: center;
}

.customize-hero__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 400;
  margin: 0.5rem 0 0;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem var(--space-side);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.step-item.active { color: var(--color-text); font-weight: 600; }
.step-item.completed { color: var(--color-accent); }

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.2s;
}

.step-item.active .step-circle { border-color: var(--color-text); background: var(--color-text); color: var(--color-bg); }
.step-item.completed .step-circle { border-color: var(--color-accent); background: var(--color-accent); color: var(--color-bg); }

/* Container */
.customize-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem var(--space-side);
}

.customize-step { display: flex; flex-direction: column; gap: 2rem; }

.customize-step__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

/* Garment Selector */
.garment-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
@media (max-width: 640px) { .garment-selector { grid-template-columns: 1fr; } }

.garment-preview {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  background: var(--color-surface);
}

.garment-img { width: 100%; display: block; aspect-ratio: 3/4; object-fit: cover; }

.placement-zone {
  position: absolute;
  border: 2px dashed rgba(255,255,255,0.4);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.7);
  font-size: 1.25rem;
  transition: all 0.2s;
  overflow: hidden;
}

.placement-zone:hover, .placement-zone.active { border-color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.1); }
.placement-zone.has-design { border-style: solid; border-color: rgba(255,255,255,0.8); }

.zone-design-thumb { width: 100%; height: 100%; object-fit: contain; }

/* Zone Controls */
.zone-label { font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.5rem; }

.zone-list { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1.5rem; }

.zone-list-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background 0.15s;
  background: transparent;
}

.zone-list-item:hover { background: var(--color-surface); }
.zone-list-item.active { background: var(--color-surface); font-weight: 600; }

.zone-dot { width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid var(--color-border); flex-shrink: 0; }
.zone-dot.filled { background: var(--color-accent); border-color: var(--color-accent); }

.zone-delete-btn {
  margin-left: auto;
  border: none;
  background: none;
  color: #fc8181;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

/* Upload */
.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: 4px;
  transition: border-color 0.2s;
}

.upload-area:hover { border-color: var(--color-text); }

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  cursor: pointer;
  text-align: center;
}

.upload-label svg { stroke: var(--color-text-muted); }
.upload-label p { margin: 0; font-size: 0.875rem; color: var(--color-text-muted); }
.upload-label span { font-size: 0.75rem; color: var(--color-text-muted); text-decoration: underline; }

/* Options */
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
@media (max-width: 640px) { .options-grid { grid-template-columns: 1fr; } }

.option-group { display: flex; flex-direction: column; gap: 0.75rem; }
.option-label { font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

.option-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.option-chip {
  padding: 0.5rem 1rem;
  border: 1.5px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 0.8125rem;
  font-family: var(--font-body);
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
}

.option-chip.active { border-color: var(--color-text); background: var(--color-text); color: var(--color-bg); }
.option-chip.disabled { opacity: 0.4; cursor: not-allowed; }

.color-chip {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s;
}

.color-chip.active { border-color: var(--color-text); transform: scale(1.15); }

/* Info Form */
.info-form { display: flex; flex-direction: column; gap: 1.25rem; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group label { font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

.co-input {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  border-radius: 2px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.co-input:focus { outline: none; border-color: var(--color-text); }
.co-textarea { resize: vertical; min-height: 80px; }

/* Summary */
.summary-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 2rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.875rem;
}

.summary-row:last-of-type { border-bottom: none; }
.summary-label { color: var(--color-text-muted); }

.summary-desc { font-size: 0.8125rem; color: var(--color-text-muted); margin: 0.5rem 0 0; font-style: italic; }

.btn-confirm { width: 100%; padding: 1rem; margin-top: 0.5rem; }

/* Success */
.summary-success {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
}

.summary-success h3 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 400; margin: 0; }
.summary-success p { color: var(--color-text-muted); margin: 0; }

/* Step Nav */
.step-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.btn-step-nav {
  padding: 0.875rem 2rem;
  font-size: 0.875rem;
  font-family: var(--font-body);
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
  letter-spacing: 0.05em;
}

.btn-prev {
  border: 1.5px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
}

.btn-prev:hover { border-color: var(--color-text); }
.btn-next { margin-left: auto; }
</style>

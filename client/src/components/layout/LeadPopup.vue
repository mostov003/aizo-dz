<template>
  <!-- Lead Popup Backdrop -->
  <div v-if="popupVisible" class="cart-drawer-backdrop active" id="lead-popup-backdrop" @click="closePopup"></div>

  <!-- Lead Popup -->
  <div v-if="popupVisible" class="lead-popup active" id="lead-popup" :class="{ active: popupAnimated }">
    <button class="btn-close-lead" id="btn-close-lead-popup" @click="closePopup" aria-label="Close popup">
      <svg fill="none" viewBox="0 0 24 24" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>

    <div v-if="!submitted">
      <div class="lead-popup__label">AIZO.DZ</div>
      <h3 class="lead-popup__title">{{ t('lead_title') }}</h3>
      <p class="lead-popup__desc">{{ t('lead_desc_ar') }}</p>

      <form id="lead-popup-form" @submit.prevent="submitLead">
        <div class="form-group" style="margin-bottom:1rem;">
          <input type="email" v-model="email" id="lead-email" :placeholder="t('lead_placeholder')" />
          <span v-if="emailError" class="field-error show" id="err-lead-email">{{ t('err_address') }}</span>
        </div>

        <div class="captcha-row" style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
          <span id="lead-captcha-question" style="font-size:0.875rem;font-weight:500;">{{ captchaQ }}</span>
          <input type="number" v-model="captchaAnswer" id="lead-captcha-answer" style="width:70px;padding:0.4rem 0.6rem;border:1px solid var(--color-border);font-size:0.875rem;" :placeholder="'= ?'" />
        </div>

        <button type="submit" class="btn-primary" style="width:100%;">{{ t('lead_subscribe') }}</button>
      </form>
    </div>

    <div v-else class="lead-popup__success" id="lead-popup-success" style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:2rem 0;">
      <div style="font-size:2.5rem;margin-bottom:1rem;">✓</div>
      <h3>{{ t('lead_success_title') }}</h3>
      <p style="color:var(--color-stone-500);font-size:0.875rem;">{{ t('lead_success_desc') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLangStore } from '@/stores/lang.js'

const langStore = useLangStore()
const t = (key) => langStore.tr(key)

const popupVisible = ref(false)
const popupAnimated = ref(false)
const submitted = ref(false)
const email = ref('')
const emailError = ref(false)
const captchaA = ref(0)
const captchaB = ref(0)
const captchaAnswer = ref('')
const captchaQ = ref('')

function initCaptcha() {
  captchaA.value = Math.floor(Math.random() * 9) + 1
  captchaB.value = Math.floor(Math.random() * 9) + 1
  captchaQ.value = `${captchaA.value} + ${captchaB.value} =`
  captchaAnswer.value = ''
}

function openPopup() {
  initCaptcha()
  popupVisible.value = true
  setTimeout(() => { popupAnimated.value = true }, 10)
  document.body.style.overflow = 'hidden'
}

function closePopup() {
  popupAnimated.value = false
  popupVisible.value = false
  document.body.style.overflow = ''
  localStorage.setItem('aizo_lead_popup_seen', 'true')
}

async function submitLead() {
  const captchaVal = captchaA.value + captchaB.value
  if (parseInt(captchaAnswer.value) !== captchaVal) {
    alert('⚠️ كود الأمان غير صحيح / CAPTCHA incorrect')
    initCaptcha()
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value.trim())) {
    emailError.value = true
    return
  }
  emailError.value = false
  const leadData = { email: email.value.trim(), date: new Date().toISOString() }
  try {
    const res = await fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    })
    if (!res.ok) throw new Error('API error')
  } catch {
    const localLeads = JSON.parse(localStorage.getItem('local_leads') || '[]')
    if (!localLeads.some(l => l.email === leadData.email)) {
      localLeads.push(leadData)
      localStorage.setItem('local_leads', JSON.stringify(localLeads))
    }
  }
  submitted.value = true
  localStorage.setItem('aizo_lead_popup_seen', 'true')
  setTimeout(closePopup, 2500)
}

onMounted(() => {
  if (!localStorage.getItem('aizo_lead_popup_seen')) {
    setTimeout(openPopup, 1000)
  }
})
</script>

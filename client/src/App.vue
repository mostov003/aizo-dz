<template>
  <div :dir="langStore.dir" :lang="langStore.lang" :class="{ 'rtl-layout': langStore.isRTL }">
    <AnnouncementBar />
    <Navbar />
    <RouterView />
    <CartDrawer />
    <LeadPopup />
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLangStore } from '@/stores/lang.js'
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import LeadPopup from '@/components/layout/LeadPopup.vue'

const langStore = useLangStore()

onMounted(() => {
  langStore.initLang()
})
</script>

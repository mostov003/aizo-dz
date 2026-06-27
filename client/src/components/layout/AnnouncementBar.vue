<template>
  <div class="announcement-bar">{{ langStore.tr('announcement') }}</div>
</template>

<script setup>
import { useLangStore } from '@/stores/lang.js'
const langStore = useLangStore()
</script>

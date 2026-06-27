<template>
  <div class="co-display-wrapper">
    <!-- Order Header with Metadata -->
    <div class="co-order-header" v-if="order">
      <h2>{{ $t('co_order_details_title') || 'Détails de la commande personnalisée' }}</h2>
      <div class="co-order-meta">
        <span class="co-meta-item">
          <strong>{{ $t('co_order_id') || 'Commande' }}:</strong>
          {{ order.orderId }}
        </span>
        <span class="co-meta-item">
          <strong>{{ $t('co_product_type') || 'Vêtement' }}:</strong>
          {{ formatProductType(order.productType) }}
        </span>
        <span class="co-meta-item">
          <strong>{{ $t('co_color') || 'Couleur' }}:</strong>
          {{ order.color }}
        </span>
        <span class="co-meta-item">
          <strong>{{ $t('co_quantity') || 'Quantité' }}:</strong>
          {{ order.quantity }}
        </span>
      </div>
    </div>

    <!-- Designs Grid - Each side in isolated container -->
    <div class="co-designs-grid" v-if="order && order.designs && order.designs.length > 0">
      <div
        v-for="(design, index) in order.designs"
        :key="`${order.orderId}-${design.sideId}`"
        :class="['co-design-card', { 'co-design-card--selected': selectedSide === design.sideId }]"
        @click="selectSide(design.sideId)"
      >
        <!-- Header: Title + Status -->
        <div class="co-design-card__header">
          <h3 class="co-design-card__title">
            {{ getSideName(design.sideId) }}
          </h3>
          <span
            :class="['co-design-card__status', `co-design-card__status--${design.status}`]"
            :data-status="design.status"
          >
            {{ getStatusLabel(design.status) }}
          </span>
        </div>

        <!-- Preview Container - Garment + Design -->
        <div class="co-design-card__preview-wrapper">
          <!-- Base Garment Image -->
          <div class="co-design-card__garment-bg">
            <img
              :src="getGarmentPreview()"
              :alt="`${order.productType} preview`"
              class="co-design-card__garment-img"
            />
          </div>

          <!-- Uploaded Design - Positioned with placement data -->
          <div
            v-if="design.imagePath"
            class="co-design-card__design-overlay"
            :style="getDesignStyle(design.placement)"
          >
            <img
              :src="design.imagePath"
              :alt="`Design for ${getSideName(design.sideId)}`"
              class="co-design-card__design-img"
            />
          </div>
        </div>

        <!-- Design Information -->
        <div class="co-design-card__info">
          <div class="co-design-card__info-row">
            <span class="co-design-card__label">{{ $t('co_position') || 'Position' }}:</span>
            <span class="co-design-card__value">
              X={{ Math.round(design.placement.x) }}, Y={{ Math.round(design.placement.y) }}
            </span>
          </div>
          <div class="co-design-card__info-row">
            <span class="co-design-card__label">{{ $t('co_scale') || 'Échelle' }}:</span>
            <span class="co-design-card__value">
              {{ Math.round(design.placement.scale * 100) }}%
            </span>
          </div>
          <div v-if="design.imageData" class="co-design-card__info-row">
            <span class="co-design-card__label">{{ $t('co_dimensions') || 'Dimensions' }}:</span>
            <span class="co-design-card__value">
              {{ design.imageData.width }}x{{ design.imageData.height }}px
            </span>
          </div>
          <div v-if="design.uploadedAt" class="co-design-card__info-row">
            <span class="co-design-card__label">{{ $t('co_uploaded') || 'Téléchargé' }}:</span>
            <span class="co-design-card__value">
              {{ formatDate(design.uploadedAt) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons - Each design has its own controls -->
        <div class="co-design-card__actions">
          <button
            class="co-design-btn co-design-btn--edit"
            @click.stop="editDesign(design.sideId)"
          >
            ✏️ {{ $t('co_edit') || 'Éditer' }}
          </button>
          <button
            class="co-design-btn co-design-btn--preview"
            @click.stop="previewDesign(design.sideId)"
          >
            👁️ {{ $t('co_preview') || 'Aperçu' }}
          </button>
          <button
            class="co-design-btn co-design-btn--delete"
            @click.stop="deleteDesign(design.sideId)"
          >
            🗑️ {{ $t('co_delete') || 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="co-empty-state">
      <p>{{ $t('co_no_designs') || 'Aucun design personnalisé trouvé.' }}</p>
    </div>

    <!-- Summary Section -->
    <div class="co-designs-summary" v-if="order && order.designs && order.designs.length > 0">
      <h3>{{ $t('co_designs_summary') || 'Résumé des designs' }}</h3>
      <div class="co-summary-list">
        <div v-for="design in order.designs" :key="design.sideId" class="co-summary-item">
          <span class="co-summary-side">{{ getSideName(design.sideId) }}</span>
          <span :class="['co-summary-status', `co-summary-status--${design.status}`]">
            {{ getStatusLabel(design.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomOrderDisplayVue',
  props: {
    order: {
      type: Object,
      required: true,
      validator: (order) => {
        return order && order.orderId && Array.isArray(order.designs);
      }
    }
  },
  data() {
    return {
      selectedSide: null,
      sideLabels: {
        front: { fr: 'Poitrine / Front', en: 'Front Chest', ar: 'الصدر' },
        back: { fr: 'Dos / Back', en: 'Back', ar: 'الظهر' },
        left_sleeve: { fr: 'Manche Gauche', en: 'Left Sleeve', ar: 'الكم الأيسر' },
        right_sleeve: { fr: 'Manche Droite', en: 'Right Sleeve', ar: 'الكم الأيمن' },
        pocket: { fr: 'Poche / Pocket', en: 'Pocket', ar: 'الجيب' }
      }
    };
  },
  methods: {
    getSideName(sideId) {
      const lang = this.$i18n?.locale || 'fr';
      return this.sideLabels[sideId]?.[lang] || this.sideLabels[sideId]?.fr || sideId;
    },

    formatProductType(type) {
      const types = {
        tshirt: 'T-Shirt',
        hoodie: 'Hoodie',
        polo: 'Polo',
        cap: 'Casquette',
        bob: 'Bob',
        jogging: 'Jogging',
        short: 'Short'
      };
      return types[type] || type;
    },

    getGarmentPreview() {
      const previewMap = {
        tshirt: '/img/preview-tshirt.png',
        hoodie: '/img/preview-hoodie.png',
        polo: '/img/preview-polo.png',
        cap: '/img/preview-cap.png',
        bob: '/img/preview-bob.png',
        jogging: '/img/preview-jogging.png',
        short: '/img/preview-short.png'
      };
      return previewMap[this.order.productType] || '/img/placeholder-tshirt.png';
    },

    getDesignStyle(placement) {
      return {
        transform: `translate(${placement.x}px, ${placement.y}px) rotate(${placement.rotation || 0}deg) scale(${placement.scale})`,
        position: 'absolute',
        top: 0,
        left: 0,
        transformOrigin: 'center'
      };
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    getStatusLabel(status) {
      const labels = {
        pending: '⏳ En attente',
        approved: '✅ Approuvé',
        rejected: '❌ Rejeté'
      };
      return labels[status] || status;
    },

    selectSide(sideId) {
      this.selectedSide = this.selectedSide === sideId ? null : sideId;
    },

    editDesign(sideId) {
      this.$emit('edit-design', sideId);
      console.log(`Editing design for side: ${sideId}`);
    },

    previewDesign(sideId) {
      this.$emit('preview-design', sideId);
      console.log(`Previewing design for side: ${sideId}`);
    },

    deleteDesign(sideId) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le design pour ${this.getSideName(sideId)} ?`)) {
        this.$emit('delete-design', sideId);
        console.log(`Deleted design for side: ${sideId}`);
      }
    }
  }
};
</script>

<style scoped>
/* Import the CSS file */
@import '../../../css/custom-order-display.css';
</style>

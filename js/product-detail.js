/* ════════════════════════════════════════════
   aizo.dz — product-detail.js
   Product Detail Page Controller
   ════════════════════════════════════════════ */

(function () {
  'use strict';

  let currentProduct = null;
  let selectedColor = null;
  let selectedSize = null;

  document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    if (!productId) {
      window.location.href = '/collections';
      return;
    }

    if (typeof loadProducts === 'function') {
      await loadProducts();
    }

    const products = window.PRODUCTS || [];
    currentProduct = products.find(p => p.id === productId);

    if (!currentProduct) {
      window.location.href = '/collections';
      return;
    }

    renderProductDetail(currentProduct);
  });

  function renderProductDetail(p) {
    // Main image
    const mainImg = document.getElementById('pd-main-img');
    if (mainImg) {
      mainImg.src = p.img;
      mainImg.alt = p.alt || p.name;
    }

    // Thumbnails
    const thumbsWrap = document.getElementById('pd-thumbs');
    if (thumbsWrap) {
      const images = [p.img];
      if (p.hoverImg) images.push(p.hoverImg);
      thumbsWrap.innerHTML = images.map((src, i) => `
        <button class="pd-thumb ${i === 0 ? 'active' : ''}" data-src="${src}">
          <img src="${src}" alt="Thumbnail ${i + 1}" loading="lazy" />
        </button>
      `).join('');

      thumbsWrap.querySelectorAll('.pd-thumb').forEach(btn => {
        btn.addEventListener('click', () => {
          thumbsWrap.querySelectorAll('.pd-thumb').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          mainImg.src = btn.dataset.src;
        });
      });
    }

    // Badge
    const badge = document.getElementById('pd-badge');
    if (badge && p.badge) {
      badge.textContent = p.badge;
      badge.className = `product-badge product-badge--${p.badgeType || 'new'}`;
      badge.style.display = '';
    }

    // Info
    const sub = document.getElementById('pd-sub');
    if (sub) sub.textContent = p.sub || '';

    const name = document.getElementById('pd-name');
    if (name) name.textContent = p.name;

    const rating = document.getElementById('pd-rating');
    if (rating) {
      const stars = '★'.repeat(p.stars || 0) + '☆'.repeat(5 - (p.stars || 0));
      rating.innerHTML = `<span class="stars">${stars}</span> <span class="rating-cnt">(${p.reviews || 0} ${(window.t ? window.t('reviews') : 'avis')})</span>`;
    }

    const price = document.getElementById('pd-price');
    if (price) {
      const numPrice = parseFloat(String(p.price).replace(/,/g, ''));
      price.innerHTML = `${numPrice.toLocaleString()} <span>DZD</span>`;
    }

    // Colors
    const colorGroup = document.getElementById('pd-color-group');
    const colorsWrap = document.getElementById('pd-colors');
    if (p.colors && p.colors.length > 0) {
      selectedColor = p.colors[0];
      colorsWrap.innerHTML = p.colors.map((c, i) => `
        <button class="pd-color-btn ${i === 0 ? 'active' : ''}" data-color="${c}">${c}</button>
      `).join('');

      colorsWrap.querySelectorAll('.pd-color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          colorsWrap.querySelectorAll('.pd-color-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedColor = btn.dataset.color;
        });
      });
    } else {
      colorGroup.style.display = 'none';
    }

    // Sizes
    const sizeGroup = document.getElementById('pd-size-group');
    const sizesWrap = document.getElementById('pd-sizes');
    if (p.sizes && p.sizes.length > 0) {
      selectedSize = p.sizes[0];
      sizesWrap.innerHTML = p.sizes.map((s, i) => `
        <button class="pd-size-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
      `).join('');

      sizesWrap.querySelectorAll('.pd-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sizesWrap.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedSize = btn.dataset.size;
        });
      });
    } else {
      sizeGroup.style.display = 'none';
    }

    // Add to Cart
    const addCartBtn = document.getElementById('pd-add-cart');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        if (window.addToCart) {
          window.addToCart(p.id, selectedColor || 'بدون لون', selectedSize || 'M');
          const span = addCartBtn.querySelector('span');
          const orig = span.textContent;
          span.textContent = '✓ ' + (window.t ? window.t('col_add_to_cart') : 'Added!');
          addCartBtn.classList.add('added');
          setTimeout(() => {
            span.textContent = orig;
            addCartBtn.classList.remove('added');
          }, 2000);
        }
      });
    }

    // Custom Order button redirect (show for all products unless explicitly disabled)
    const customBtn = document.getElementById('pd-custom-order');
    if (customBtn) {
      if (p.customizable === false) {
        customBtn.style.display = 'none';
      } else {
        customBtn.style.display = '';
        customBtn.addEventListener('click', () => {
          window.location.href = `/customize?id=${p.id}`;
        });
      }
    }

    document.title = `${p.name} — AIZO.DZ`;
  }

})();

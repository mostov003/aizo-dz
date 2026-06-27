/* ════════════════════════════════════════════
   aizo.dz — products.js
   Product data & dynamic card rendering with color and size selection
   ════════════════════════════════════════════ */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Denim Jeans",
    sub: "Edo collection",
    price: "8,400",
    badge: "New",
    badgeType: "new",
    stars: 5,
    reviews: 28,
    img: "https://i.pinimg.com/736x/5b/0e/55/5b0e55765d14b77877e75fca2315ae6f.jpg",
    alt: "Edo collection Denim Jeans",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "أزرق"],
    category: "Jeans"
  },
  {
    id: 2,
    name: "Tsuru Denim",
    sub: "Edo collection",
    price: "18,500",
    badge: null,
    stars: 5,
    reviews: 14,
    img: "https://pbs.twimg.com/media/HFOcFnRaEAEGqVB?format=jpg&name=large",
    alt: "Edo collection Tsuru Denim",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "أزرق"],
    category: "Jeans"
  },
  {
    id: 3,
    name: "Solace Denim",
    sub: "Edo collection",
    price: "34,900",
    badge: "Limited",
    badgeType: "limited",
    stars: 4,
    reviews: 9,
    img: "https://i.pinimg.com/736x/f4/d4/85/f4d485c8288184f455a9be415a7a775d.jpg",
    alt: "Edo collection Solace Denim",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "أبيض"],
    category: "Jeans"
  },
  {
    id: 4,
    name: "Black Vescartes Ronin Jacket",
    sub: "Vescartes",
    price: "12,200",
    badge: null,
    stars: 5,
    reviews: 41,
    img: "https://i.pinimg.com/736x/fa/14/b3/fa14b392e687ec62d0bbe320e81ca10d.jpg",
    alt: "Black Vescartes Ronin Jacket",
    sizes: ["M", "L", "XL"],
    colors: ["أسود"],
    category: "Jackets"
  },
  {
    id: 5,
    name: "Stüssy Dragon Sherpa Jacket",
    sub: "The Stüssy Fall/Winter 2022 collection",
    price: "18,900",
    badge: "New",
    badgeType: "new",
    stars: 5,
    reviews: 17,
    img: "https://i.pinimg.com/736x/fa/b3/77/fab3779ed69b193b27fa90960c949975.jpg",
    alt: "Stüssy Dragon Sherpa Jacket",
    sizes: ["S", "M", "L"],
    colors: ["أسود", "أبيض"],
    category: "Jackets"
  },
  {
    id: 6,
    name: "Vescartes Oni Hoodie",
    sub: "Vescartes",
    price: "14,500",
    badge: null,
    stars: 4,
    reviews: 22,
    img: "https://i.pinimg.com/736x/2b/5d/60/2b5d60ac344515aada335e3ce17938aa.jpg",
    alt: "Vescartes Oni Hoodie",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "أبيض"],
    category: "Hoodies"
  },
  {
    id: 7,
    name: "Lily & Fang Denim",
    sub: "Vescartes",
    price: "21,100",
    badge: "Sale",
    badgeType: "sale",
    stars: 5,
    reviews: 36,
    img: "https://i.pinimg.com/736x/4d/80/66/4d8066053a67773110d4ef407a7094da.jpg",
    alt: "Lily & Fang Denim",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "أزرق"],
    category: "Jeans"
  },
  {
    id: 8,
    name: "Ryu Denim Jacket",
    sub: "Edo Collection",
    price: "11,600",
    badge: null,
    stars: 5,
    reviews: 53,
    img: "https://i.pinimg.com/736x/a2/ed/57/a2ed57555ddebae7c8f69fbcb20011e8.jpg",
    alt: "Ryu Denim Jacket",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["أزرق", "أسود"],
    category: "Jackets"
  }
];

let PRODUCTS = [];
let PRODUCT_STOCKS = {};

// Make PRODUCTS globally accessible
window.PRODUCTS = PRODUCTS;

/* ── Fetch Real-time Stock levels from local server ── */
async function loadProductStocks() {
  try {
    const apiUrl = (window.API_BASE_URL || '') + '/api/product-stocks';
    const res = await fetch(apiUrl, { signal: AbortSignal?.timeout?.(5000) });
    if (res.ok) {
      PRODUCT_STOCKS = await res.json();
      console.log('📦 تم تحميل المخزون:', Object.keys(PRODUCT_STOCKS).length, 'عنصر');
    }
  } catch (err) {
    console.warn('⚠️ لم يتمكن من جلب المخزون من API:', err.message);
  }
}

window.loadProductStocks = loadProductStocks;

/* ── Local Server API Helpers ── */
async function cloudGetDefaultOverrides() {
  try {
    const apiUrl = (window.API_BASE_URL || '') + '/api/default-overrides';
    console.log('📥 جاري جلب تعديلات المنتجات الافتراضية من:', apiUrl);
    const res = await fetch(apiUrl, { signal: AbortSignal?.timeout?.(5000) });
    if (res.ok) {
      const overrides = await res.json();
      console.log('✓ تم تحميل تعديلات المنتجات الافتراضية');
      return overrides;
    }
  } catch (err) {
    console.warn('⚠️ لم يتمكن من جلب تعديلات المنتجات الافتراضية:', err.message);
  }
  return {};
}

async function cloudGetProducts() {
  try {
    const apiUrl = (window.API_BASE_URL || '') + '/api/custom-products';
    console.log('📥 جاري جلب المنتجات المخصصة من:', apiUrl);
    const res = await fetch(apiUrl, { signal: AbortSignal?.timeout?.(5000) });
    if (res.ok) {
      const prods = await res.json();
      console.log('✓ تم تحميل', prods.length, 'منتج مخصص');
      return prods;
    } else {
      console.warn('⚠️ فشل الرد من السيرفر:', res.status);
    }
  } catch (err) {
    console.warn('⚠️ لم يتمكن من الوصول إلى السيرفر:', err.message);
  }
  return null;
}

window.cloudGetProducts = cloudGetProducts;

/* ── Load products & stocks ── */
async function loadProducts(forceRefresh) {
  if (PRODUCTS.length > 0 && !forceRefresh) {
    console.log('✓ استخدام المنتجات المحملة مسبقاً من الذاكرة (سريع)');
    return;
  }
  console.log('🔄 جاري تحميل المنتجات من السيرفر...');
  try {
    await loadProductStocks();
  } catch(err) {
    console.warn('⚠️ خطأ في تحميل المخزون:', err.message);
  }
  
  // Get default overrides
  const overrides = await cloudGetDefaultOverrides();
  localStorage.setItem('default_overrides', JSON.stringify(overrides));
  
  // Process defaults with overrides
  let processedDefaults = DEFAULT_PRODUCTS.map(p => {
    const override = overrides[p.id];
    if (override) {
      return { ...p, ...override };
    }
    return p;
  }).filter(p => !p.hidden);

  const cloudProds = await cloudGetProducts();
  if (cloudProds !== null) {
    localStorage.setItem('custom_products', JSON.stringify(cloudProds));
    PRODUCTS = [...processedDefaults, ...cloudProds];
    window.PRODUCTS = PRODUCTS;
    console.log('✓ تم تحميل', PRODUCTS.length, 'منتج إجمالي');
  } else {
    const customProducts = JSON.parse(localStorage.getItem('custom_products') || '[]');
    const storedOverrides = JSON.parse(localStorage.getItem('default_overrides') || '{}');
    let localProcessedDefaults = DEFAULT_PRODUCTS.map(p => {
      const override = storedOverrides[p.id];
      if (override) {
        return { ...p, ...override };
      }
      return p;
    }).filter(p => !p.hidden);
    
    PRODUCTS = [...localProcessedDefaults, ...customProducts];
    window.PRODUCTS = PRODUCTS;
    console.log('✓ تم تحميل', PRODUCTS.length, 'منتج من الذاكرة المحلية');
  }
}

/* ── Build star string ── */
function buildStars(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

/* ── Build product card HTML ── */
function buildCard(p, delay = 0) {
  const badge = p.badge
    ? `<span class="product-badge product-badge--${p.badgeType}">${p.badge}</span>`
    : '';

  const sizesData = p.sizes && p.sizes.length > 0 ? JSON.stringify(p.sizes) : '[]';
  const colorsData = p.colors && p.colors.length > 0 ? JSON.stringify(p.colors) : JSON.stringify(["أسود", "أبيض"]);

  const hoverImgHtml = p.hoverImg 
    ? `<img class="product-card__img product-card__img--hover" src="${p.hoverImg}" alt="${p.alt} detail" loading="lazy" />`
    : '';

  return `
    <article class="product-card reveal" id="product-${p.id}" style="transition-delay:${delay}s">
      <a href="/product?id=${p.id}" class="product-card__link" aria-label="View ${p.name}">
        <div class="product-card__image-wrap">
          <img
            class="product-card__img product-card__img--primary"
            src="${p.img}"
            alt="${p.alt}"
            loading="lazy"
          />
          ${hoverImgHtml}
          ${badge}
          <div class="product-card__cta">
            <button
              class="btn-add-cart"
              id="add-cart-${p.id}"
              data-id="${p.id}"
              data-sizes='${sizesData}'
              data-colors='${colorsData}'
              aria-label="Add ${p.name} to cart"
            >Add to Cart</button>
          </div>
        </div>
        <div class="product-card__info">
          <div>
            <p class="product-card__name">${p.name}</p>
            <p class="product-card__sub">${p.sub}</p>
          </div>
          <p class="product-card__price">${parseFloat(String(p.price).replace(/,/g, '')).toLocaleString()} <span>DZD</span></p>
        </div>
        <div class="product-card__rating">
          <span class="stars">${buildStars(p.stars)}</span>
          <span class="rating-cnt">(${p.reviews})</span>
        </div>
      </a>
    </article>
  `;
}

/* ── Render all products ── */
async function renderProducts() {
  await loadProducts();
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (typeof window.filterAndRenderProducts === 'function') {
    window.filterAndRenderProducts(window.activeCategory || 'all');
  } else {
    grid.innerHTML = PRODUCTS.map((p, i) => {
      const delay = (i % 4) * 0.1;
      return buildCard(p, delay);
    }).join('');

    if (window.revealObserver) {
      grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }

    grid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', handleAddToCartClick);
    });
  }
}

/* ── Add to cart button handler with Dual Step Color/Size Selector ── */
function handleAddToCartClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const btn = e.currentTarget;
  const productId = parseInt(btn.getAttribute('data-id'));
  const sizes = JSON.parse(btn.getAttribute('data-sizes') || '[]');
  const colors = JSON.parse(btn.getAttribute('data-colors') || '[]');
  const imgWrap = btn.closest('.product-card__image-wrap');

  if (imgWrap.querySelector('.size-picker-overlay')) return;

  const hasColors = colors.length > 0 && !(colors.length === 1 && colors[0] === 'بدون لون');
  const hasSizes = sizes.length > 0;

  if (hasColors && hasSizes) {
    // Show Dual Step (Color then Size)
    const overlay = document.createElement('div');
    overlay.className = 'size-picker-overlay';
    overlay.innerHTML = `
      <button class="size-picker-close" aria-label="Close picker">×</button>
      <p class="size-picker-title">اختر اللون / Select Color</p>
      <div class="size-picker-options color-options">
        ${colors.map(col => `<button class="btn-size-option btn-color-option" data-color="${col}">${col}</button>`).join('')}
      </div>
    `;
    imgWrap.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);

    // Close Handler
    overlay.querySelector('.size-picker-close').addEventListener('click', (closeEvent) => {
      closeEvent.stopPropagation();
      closeSizePicker(overlay);
    });

    // Color Options Handlers
    overlay.querySelectorAll('.btn-color-option').forEach(colBtn => {
      colBtn.addEventListener('click', (colEvent) => {
        colEvent.stopPropagation();
        const selectedColor = colBtn.getAttribute('data-color');
        showSizesStep(overlay, productId, selectedColor, sizes);
      });
    });

  } else if (hasSizes) {
    // Only sizes, skip color
    const overlay = document.createElement('div');
    overlay.className = 'size-picker-overlay';
    imgWrap.appendChild(overlay);
    showSizesStep(overlay, productId, 'بدون لون', sizes);
    setTimeout(() => overlay.classList.add('active'), 10);

  } else if (hasColors) {
    // Only colors, skip size
    const overlay = document.createElement('div');
    overlay.className = 'size-picker-overlay';
    overlay.innerHTML = `
      <button class="size-picker-close" aria-label="Close picker">×</button>
      <p class="size-picker-title">اختر اللون / Select Color</p>
      <div class="size-picker-options color-options">
        ${colors.map(col => `<button class="btn-size-option btn-color-select" data-color="${col}">${col}</button>`).join('')}
      </div>
    `;
    imgWrap.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);

    overlay.querySelector('.size-picker-close').addEventListener('click', (closeEvent) => {
      closeEvent.stopPropagation();
      closeSizePicker(overlay);
    });

    overlay.querySelectorAll('.btn-color-select').forEach(colBtn => {
      colBtn.addEventListener('click', (colEvent) => {
        colEvent.stopPropagation();
        const selectedColor = colBtn.getAttribute('data-color');
        if (window.addToCart) {
          window.addToCart(productId, selectedColor, 'M');
        }
        colBtn.textContent = '✓';
        colBtn.classList.add('selected');
        setTimeout(() => closeSizePicker(overlay), 800);
      });
    });

  } else {
    // No options: add directly to cart
    if (window.addToCart) {
      window.addToCart(productId, 'بدون لون', 'M');
    }
    
    const orig = btn.textContent.trim();
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove('added');
    }, 1800);
  }
}

/* ── Transition to Size Selection with Real-time Stock Validation ── */
function showSizesStep(overlay, productId, color, sizes) {
  overlay.innerHTML = `
    <button class="size-picker-close" aria-label="Close picker">×</button>
    <p class="size-picker-title">اختر المقاس / Select Size ${color !== 'بدون لون' ? `(${color})` : ''}</p>
    <div class="size-picker-options">
      ${sizes.map(sz => {
        const key = `${productId}-${color}-${sz}`;
        const stock = PRODUCT_STOCKS[key] !== undefined ? PRODUCT_STOCKS[key] : 10;
        const outOfStock = stock <= 0;
        const label = outOfStock ? `${sz} (نفذ / Out of Stock)` : sz;
        const disabledAttr = outOfStock ? 'disabled style="opacity:0.4; text-decoration:line-through; cursor:not-allowed;"' : '';
        return `<button class="btn-size-option btn-sz-select" data-size="${sz}" ${disabledAttr}>${label}</button>`;
      }).join('')}
    </div>
  `;

  overlay.querySelector('.size-picker-close').addEventListener('click', (closeEvent) => {
    closeEvent.stopPropagation();
    closeSizePicker(overlay);
  });

  overlay.querySelectorAll('.btn-sz-select').forEach(szBtn => {
    szBtn.addEventListener('click', (szEvent) => {
      szEvent.stopPropagation();
      const selectedSize = szBtn.getAttribute('data-size');
      
      if (window.addToCart) {
        window.addToCart(productId, color, selectedSize);
      }

      szBtn.textContent = '✓';
      szBtn.classList.add('selected');
      
      setTimeout(() => {
        closeSizePicker(overlay);
      }, 800);
    });
  });
}

/* ── Close overlay with animation ── */
function closeSizePicker(overlay) {
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.remove();
  }, 300);
}

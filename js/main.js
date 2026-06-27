/* ════════════════════════════════════════════
   aizo.dz — main.js
   UI Interactions, Scroll Effects, Cart & Checkout Logic
   ════════════════════════════════════════════ */

// Cart state
let cart = [];
let appInitialized = false;

function debounce(fn, delay = 100) {
  let timeoutId;
  return function(...args) {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
  };
}

function initApp() {
  if (appInitialized) return;
  appInitialized = true;

  /* ────────────────────────────────────────
     1. SCROLL REVEAL — IntersectionObserver
     ──────────────────────────────────────── */
  window.revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ────────────────────────────────────────
     2. PRODUCT FILTER & RENDER HOOKS
     ──────────────────────────────────────── */
  window.activeCategory = 'all';
  window.searchQuery = '';
  window.sortBy = 'featured';

  window.filterAndRenderProducts = function(category) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let filtered = window.PRODUCTS || PRODUCTS || [];
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    if (window.searchQuery) {
      const q = window.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sub && p.sub.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (window.sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => {
        const pA = parseFloat(String(a.price).replace(/,/g, ''));
        const pB = parseFloat(String(b.price).replace(/,/g, ''));
        return pA - pB;
      });
    } else if (window.sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => {
        const pA = parseFloat(String(a.price).replace(/,/g, ''));
        const pB = parseFloat(String(b.price).replace(/,/g, ''));
        return pB - pA;
      });
    } else if (window.sortBy === 'name-asc') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (window.sortBy === 'name-desc') {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    }

    grid.innerHTML = filtered.map((p, i) => {
      const delay = (i % 4) * 0.1;
      return buildCard(p, delay);
    }).join('');

    if (window.revealObserver) {
      grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }

    grid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', handleAddToCartClick);
    });

    const countEl = document.getElementById('active-products-count');
    if (countEl) countEl.textContent = filtered.length;
  };

  renderProducts();

  /* ────────────────────────────────────────
     2a. CATEGORY FILTER & SEARCH & SORT
     ──────────────────────────────────────── */
  const categoryBtns = document.querySelectorAll('.category-btn');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  
  // Read category from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');
  if (urlCategory) {
    window.activeCategory = urlCategory.toLowerCase();
    categoryBtns.forEach(btn => {
      if (btn.getAttribute('data-category').toLowerCase() === window.activeCategory) {
        btn.classList.add('category-btn--active');
      } else {
        btn.classList.remove('category-btn--active');
      }
    });
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('category-btn--active'));
      btn.classList.add('category-btn--active');
      window.activeCategory = btn.getAttribute('data-category');
      window.filterAndRenderProducts(window.activeCategory);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      window.searchQuery = e.target.value;
      window.filterAndRenderProducts(window.activeCategory);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      window.sortBy = e.target.value;
      window.filterAndRenderProducts(window.activeCategory);
    });
  }

  window.filterAndRenderProducts = function(category) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let filtered = window.PRODUCTS || PRODUCTS || [];
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    if (window.searchQuery) {
      const q = window.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.sub && p.sub.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (window.sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => {
        const pA = parseFloat(String(a.price).replace(/,/g, ''));
        const pB = parseFloat(String(b.price).replace(/,/g, ''));
        return pA - pB;
      });
    } else if (window.sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => {
        const pA = parseFloat(String(a.price).replace(/,/g, ''));
        const pB = parseFloat(String(b.price).replace(/,/g, ''));
        return pB - pA;
      });
    } else if (window.sortBy === 'name-asc') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (window.sortBy === 'name-desc') {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    }

    grid.innerHTML = filtered.map((p, i) => {
      const delay = (i % 4) * 0.1;
      return buildCard(p, delay);
    }).join('');

    if (window.revealObserver) {
      grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }

    grid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', handleAddToCartClick);
    });

    const countEl = document.getElementById('active-products-count');
    if (countEl) countEl.textContent = filtered.length;
  };


  /* ────────────────────────────────────────
     2b. HERO SLIDESHOW
     ──────────────────────────────────────── */
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000); // Change image every 5 seconds
  }


  /* ────────────────────────────────────────
     3. NAVBAR — glass effect on scroll
     ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ────────────────────────────────────────
     3b. ADJUST BODY OFFSET — prevent header overlapping content on mobile
     Calculate combined height of announcement bar + navbar and apply padding-top to body
  ──────────────────────────────────────── */
  function adjustBodyOffset() {
    try {
      const ann = document.querySelector('.announcement-bar');
      const nav = document.getElementById('navbar');
      let total = 0;
      if (ann) total += Math.ceil(ann.getBoundingClientRect().height);
      if (nav) total += Math.ceil(nav.getBoundingClientRect().height);
      // Add a small safety gap
      total += 6;
      document.documentElement.style.setProperty('--top-offset', total + 'px');
      document.body.style.paddingTop = total + 'px';
      // Also set scroll-padding so anchor links account for header
      document.documentElement.style.scrollPaddingTop = total + 'px';
    } catch (e) {
      console.warn('adjustBodyOffset failed', e);
    }
  }

  // Run on load and when resizing/orientation change
  adjustBodyOffset();
  window.addEventListener('resize', debounce(adjustBodyOffset, 120));
  window.addEventListener('orientationchange', () => setTimeout(adjustBodyOffset, 160));


  /* ────────────────────────────────────────
     4. MOBILE MENU — hamburger toggle
     ──────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const sideDrawer  = document.getElementById('side-drawer');
  const mobileMenu  = document.getElementById('mobile-menu');
  const sideDrawerClose = document.getElementById('side-drawer-close');
  const sideDrawerBackdrop = document.getElementById('side-drawer-backdrop');

  const drawerTarget = sideDrawer || mobileMenu;
  const isSideDrawer = Boolean(sideDrawer);

  if (hamburger && drawerTarget) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      drawerTarget.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      if (isSideDrawer) {
        sideDrawerBackdrop?.classList.toggle('open', isOpen);
        sideDrawerBackdrop?.setAttribute('aria-hidden', !isOpen);
      }
    });

    drawerTarget.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawerTarget.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        if (isSideDrawer) {
          sideDrawerBackdrop?.classList.remove('open');
          sideDrawerBackdrop?.setAttribute('aria-hidden', 'true');
        }
      });
    });

    sideDrawerClose?.addEventListener('click', () => {
      if (!isSideDrawer) return;
      hamburger.classList.remove('open');
      sideDrawer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      sideDrawerBackdrop?.classList.remove('open');
      sideDrawerBackdrop?.setAttribute('aria-hidden', 'true');
    });

    if (isSideDrawer) {
      sideDrawerBackdrop?.addEventListener('click', () => {
        hamburger.classList.remove('open');
        sideDrawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        sideDrawerBackdrop?.classList.remove('open');
        sideDrawerBackdrop?.setAttribute('aria-hidden', 'true');
      });
    }
  }


  /* ────────────────────────────────────────
     5. NEWSLETTER FORM
     ──────────────────────────────────────── */
  const nlForm    = document.getElementById('nl-form');
  const nlSuccess = document.getElementById('nl-success');

  // Math Captcha for newsletter
  let nlCaptchaVal = 0;
  const initNlCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    nlCaptchaVal = a + b;
    const qEl = document.getElementById('nl-captcha-question');
    if (qEl) qEl.textContent = `${a} + ${b} =`;
    const ansEl = document.getElementById('nl-captcha-answer');
    if (ansEl) ansEl.value = '';
  };
  if (nlForm) initNlCaptcha();

  if (nlForm) {
    nlForm.addEventListener('submit', async e => {
      e.preventDefault();
      
      const captchaAns = parseInt(document.getElementById('nl-captcha-answer').value, 10);
      if (captchaAns !== nlCaptchaVal) {
        alert('⚠️ التحقق من كود الأمان غير صحيح / CAPTCHA incorrect');
        initNlCaptcha();
        return;
      }

      const emailInput = document.getElementById('nl-email');
      const email = emailInput ? emailInput.value.trim() : '';
      const leadData = { email, date: new Date().toISOString() };
      
      // Save to centralized backend, fallback to localStorage if server is down
      try {
        const apiUrl = (window.API_BASE_URL || '') + '/api/leads';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        });
        if (!res.ok) throw new Error('API response not OK');
      } catch (err) {
        console.warn('Newsletter lead could not be saved to server, saving to localStorage:', err);
        let localLeads = [];
        try {
          localLeads = JSON.parse(localStorage.getItem('local_leads') || '[]');
        } catch(e) {
          console.error(e);
        }
        if (!localLeads.some(l => l.email === email)) {
          localLeads.push(leadData);
          localStorage.setItem('local_leads', JSON.stringify(localLeads));
        }
      }
      nlForm.style.display = 'none';
      nlSuccess.classList.add('show');
    });
  }


  /* ────────────────────────────────────────
     6. LOAD MORE — reveal extra products
     ──────────────────────────────────────── */
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.textContent = 'Loading…';
      loadMoreBtn.disabled    = true;
      setTimeout(() => {
        loadMoreBtn.textContent = 'No More Products';
        loadMoreBtn.style.opacity = '0.4';
        loadMoreBtn.style.cursor  = 'default';
      }, 900);
    });
  }


  /* ────────────────────────────────────────
     7. SMOOTH ANCHOR LINKS
     ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ────────────────────────────────────────
     8. CART DRAWER & CHECKOUT LOGIC (NEW)
     ──────────────────────────────────────── */
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartTrigger = document.getElementById('cart-trigger');
  const closeCartBtn = document.getElementById('btn-close-cart');
  const emptyShopBtn = document.getElementById('btn-empty-shop');
  const checkoutForm = document.getElementById('checkout-form');
  const orderSuccessScreen = document.getElementById('order-success-screen');
  const btnSuccessClose = document.getElementById('btn-success-close');
  const cartCheckoutSection = document.getElementById('cart-checkout-section');
  const cartEmptyState = document.getElementById('cart-empty');

  // Load cart from LocalStorage
  const loadCart = () => {
    cart = JSON.parse(localStorage.getItem('aizo_cart') || '[]');
    updateCartUI();
  };

  // Open Cart
  const openCart = () => {
    cartDrawer.classList.add('active');
    cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock body scroll
    // Ensure internal cart body scrolls to show the confirm button on mobile
    setTimeout(() => {
      const body = cartDrawer.querySelector('.cart-drawer__body');
      const confirm = document.getElementById('btn-confirm-order');
      if (body && confirm) {
        // Scroll so confirm button is visible at bottom with some offset
        confirm.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 120);
  };

  // Close Cart
  const closeCart = () => {
    cartDrawer.classList.remove('active');
    cartBackdrop.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
    
    // If order was successful, reset screen on close
    setTimeout(() => {
      if (orderSuccessScreen.style.display === 'block') {
        orderSuccessScreen.style.display = 'none';
        cartEmptyState.style.display = 'flex';
      }
    }, 450);
  };

  window.openCart = openCart;
  window.closeCart = closeCart;
  window.loadCart = loadCart;

  cartTrigger.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);
  if (emptyShopBtn) {
    emptyShopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCart();
      const collection = document.getElementById('collection');
      if (collection) collection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Global Cart Operations
  window.addToCart = (productId, color, size) => {
    console.log('addToCart called', { productId, color, size });
    // Find product in PRODUCTS array
    let product = PRODUCTS.find(p => p.id === productId);
    // fallback: try string comparison
    if (!product) product = PRODUCTS.find(p => String(p.id) === String(productId));
    if (!product) {
      console.warn('addToCart: product not found for id', productId);
      alert('خطأ: المنتج غير موجود. حاول تحديث الصفحة وإعادة المحاولة.');
      return;
    }

    // Check if item already exists in cart with the same color and size
    const existingIndex = cart.findIndex(item => item.id === productId && item.color === color && item.size === size);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        sub: product.sub,
        price: parseFloat(String(product.price).replace(/,/g, '')),
        img: product.img,
        color: color || "أسود",
        size: size || "M",
        quantity: 1
      });
    }

    saveCart();
    updateCartUI();
    openCart();
  };

  window.removeFromCart = (productId, color, size) => {
    cart = cart.filter(item => !(item.id === productId && item.color === color && item.size === size));
    saveCart();
    updateCartUI();
  };

  window.updateCartQuantity = (productId, color, size, delta) => {
    const item = cart.find(item => item.id === productId && item.color === color && item.size === size);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      window.removeFromCart(productId, color, size);
    } else {
      saveCart();
      updateCartUI();
    }
  };

  const saveCart = () => {
    localStorage.setItem('aizo_cart', JSON.stringify(cart));
  };

  // Render & UI Updates
  function updateCartUI() {
    // Total count badge
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.textContent = totalCount;

    const itemsList = document.getElementById('cart-items-list');

    // If cart UI parts are not present (page without drawer), just stop after saving
    if (!itemsList || !cartEmptyState || !cartCheckoutSection) {
      console.warn('updateCartUI: cart UI elements missing on this page. Cart saved to localStorage.');
      return;
    }

    if (cart.length === 0) {
      cartEmptyState.style.display = 'flex';
      itemsList.innerHTML = '';
      cartCheckoutSection.style.display = 'none';
      return;
    }

    cartEmptyState.style.display = 'none';
    cartCheckoutSection.style.display = 'block';

    // Render Cart Items
    itemsList.innerHTML = cart.map(item => {
      const colorTag = item.color ? `<span style="background:var(--color-stone-100); padding:2px 6px; border-radius:4px; font-size:0.75rem;">اللون: ${item.color}</span>` : '';
      const sizeTag = item.size ? `<span style="background:var(--color-stone-100); padding:2px 6px; border-radius:4px; font-size:0.75rem;">المقاس: ${item.size}</span>` : '';
      const variantInfo = `<div style="display:flex; gap:6px; margin:4px 0;">${colorTag} ${sizeTag}</div>`;
      
      const colParam = item.color ? `'${item.color}'` : 'null';
      const szParam = item.size ? `'${item.size}'` : 'null';
      
      return `
        <div class="cart-item">
          <div class="cart-item__img-wrap">
            <img src="${item.img}" alt="${item.name}" />
          </div>
          <div class="cart-item__details">
            <div>
              <p class="cart-item__title">${item.name}</p>
              ${variantInfo}
              <button class="btn-remove-item" onclick="window.removeFromCart(${item.id}, ${colParam}, ${szParam})">حذف / Remove</button>
            </div>
            <div class="cart-item__meta">
              <div class="qty-selector">
                <button class="qty-btn" onclick="window.updateCartQuantity(${item.id}, ${colParam}, ${szParam}, -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="window.updateCartQuantity(${item.id}, ${colParam}, ${szParam}, 1)">+</button>
              </div>
              <span class="cart-item__price">${(item.price * item.quantity).toLocaleString()} DZD</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Summary calculations
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    // Dynamic shipping based on selected Wilaya & delivery type (ZR Express rates)
    const _wilayaEl = document.getElementById('checkout-wilaya');
    const _deliveryEl = document.querySelector('input[name="delivery-type"]:checked');
    const _wilayaCode = _wilayaEl && _wilayaEl.value ? parseInt(_wilayaEl.value) : 0;
    const _deliveryType = _deliveryEl ? _deliveryEl.value : 'home';
    const shipping = window.getShippingCost ? window.getShippingCost(_wilayaCode, _deliveryType) : 600;
    const total = subtotal + shipping;

    document.getElementById('cart-subtotal').textContent = `${subtotal.toLocaleString()} DZD`;
    document.getElementById('cart-shipping').textContent = `${shipping.toLocaleString()} DZD`;
    document.getElementById('cart-total').textContent = `${total.toLocaleString()} DZD`;
  }

  // Initialize cart load
  loadCart();
  if (window.updateDeliveryPriceDisplay) window.updateDeliveryPriceDisplay();

  // Initialize language from localStorage or browser default
  if (window.setLanguage) {
    const savedLang = localStorage.getItem('aizo_lang') || 'fr';
    window.setLanguage(savedLang);
  }

  // Checkout Form Validation & Submission
  if (checkoutForm) {
    // Error alert close button handler
    const errorAlert = document.getElementById('checkout-error-alert');
    const errorCloseBtn = document.getElementById('checkout-error-close');
    if (errorCloseBtn) {
      errorCloseBtn.addEventListener('click', () => {
        errorAlert.style.display = 'none';
      });
    }

    // قائمة مكاتب ZR Express المتاحة (تدعم الـ Pickup)
    const ZR_OFFICES = [
      { name: "مكتب دلس 35", wilaya: 35, address: "Dellys" },
      { name: "مكتب القبة 16", wilaya: 16, address: "Rue Chebihi Moussa" },
      { name: "مكتب المنيعة 58", wilaya: 58, address: "el menea" },
      { name: "Zouaghi 25", wilaya: 25, address: "L'Eucalyptus" },
      { name: "Hub Touggourt 55", wilaya: 55, address: "Touggourt" },
      { name: "مكتب بني عباس 52", wilaya: 52, address: "Beni Abbes" },
      { name: "مكتب أولاد جلال 51", wilaya: 51, address: "Elrahba" },
      { name: "مكتب غيليزان 48", wilaya: 48, address: "Cite 42 logements" },
      { name: "Hub Ghardaia 47", wilaya: 47, address: "Quartier Hadj Messaoud" },
      { name: "Hub Ain Temouchent 46", wilaya: 46, address: "Hai Zeitoun" },
      { name: "مكتب النعامة 45", wilaya: 45, address: "Cite 66 logements - Mecheria" },
      { name: "مكتب القليعة 42", wilaya: 42, address: "Route d'Alger cite cnep 140" },
      { name: "مكتب تيبازة 42", wilaya: 42, address: "Rabta" },
      { name: "Hub Souk Ahras 41", wilaya: 41, address: "RN 16 cooperatives el yassamine" },
      { name: "Hub Khenchela 40", wilaya: 40, address: "Park Omnisport" },
      { name: "مكتب الطارف 36", wilaya: 36, address: "El Tarf" },
      { name: "Hub Bordj menaiel 35", wilaya: 35, address: "Bordj Menael" },
      { name: "Hub Boumerdes 35", wilaya: 35, address: "Boulevard du ler Novembre" },
      { name: "Hub Bordj bouareridj 34", wilaya: 34, address: "Cite Chelbabi-Lagarre" },
      { name: "مكتب البيض 32", wilaya: 32, address: "Cite CNEP" },
      { name: "مكتب ما رافال 37", wilaya: 31, address: "Maraval" },
      { name: "Hub El Morchid 31", wilaya: 31, address: "Morchid" },
      { name: "Hub Canastel 37", wilaya: 31, address: "Canastel" },
      { name: "Hub Hassi Messaoud 30", wilaya: 30, address: "Cite 60 Logts" },
      { name: "مكتب معسكر 29", wilaya: 29, address: "Avenue Mehor Mehieddine" },
      { name: "Hub Bou Saada 28", wilaya: 28, address: "Meitar" },
      { name: "مكتب مسيلة 28", wilaya: 28, address: "Cite Ichbilia" },
      { name: "Hub Mostaganem 27", wilaya: 27, address: "Boulevard Moufti Benkara Mostafa" },
      { name: "مكتب المدية 26", wilaya: 26, address: "Rue Rouis Kadour (Beziwesh)" },
      { name: "مكتب المنظر الجميل 25", wilaya: 25, address: "Rue Barkat Lakhdar" },
      { name: "Hub NOUVELLE VILLE 25", wilaya: 25, address: "Cite Kadri Ibrahim" },
      { name: "مكتب قالمة 24", wilaya: 24, address: "Hassani Mohamed" },
      { name: "مكتب البوني 23", wilaya: 23, address: "Bungalows" },
      { name: "مكتب عنابة 23", wilaya: 23, address: "Rue De L'avant Port" },
      { name: "مكتب سكيكدة 21", wilaya: 21, address: "Mokhbi Leulmi" },
      { name: "مكتب سعيدة 20", wilaya: 20, address: "Cite 5 Juillet" },
      { name: "مكتب سطيف 19", wilaya: 19, address: "Cite Dallas 3eme Tranche" },
      { name: "مكتب الطاهير 18", wilaya: 18, address: "Boukaabour" },
      { name: "مكتب جيجل 18", wilaya: 18, address: "Freres Kamel" },
      { name: "مكتب الجلفة 17", wilaya: 17, address: "Cite Berrbih" },
      { name: "Reghaia 16", wilaya: 16, address: "Cite Amirouche 692" },
      { name: "Hub Ouled fayet 16", wilaya: 16, address: "CC2" },
      { name: "مكتب بئر خادم 16", wilaya: 16, address: "Que de Constantine" },
      { name: "مكتب براقي 16", wilaya: 16, address: "Route de l'arbaa" },
      { name: "مكتب بئرتوتة 16", wilaya: 16, address: "Bouhadja Ali" },
      { name: "مكتب تيارت 14", wilaya: 14, address: "route de l'academie" },
      { name: "مكتب تلمسان 13", wilaya: 13, address: "Cite el Imama" },
      { name: "مكتب تبسة 12", wilaya: 12, address: "Larbi Tebessi" },
      { name: "Hub Tamanrasset 11", wilaya: 11, address: "Cite El wiam" },
      { name: "Hub Mouzaia 09", wilaya: 9, address: "Ben Ahmed Ali Aslaoui" },
      { name: "مكتب بوقرة 10", wilaya: 9, address: "Hamidouch Mouloud, route d'alger" },
      { name: "مكتب البليدة 09", wilaya: 9, address: "Cite Ramoule" },
      { name: "مكتب بسكرة 30", wilaya: 7, address: "Cite El-Kors" },
      { name: "مكتب أ (أكبو) 06", wilaya: 6, address: "Gare ferroviaire Akbou" },
      { name: "مكتب بجاية 06", wilaya: 6, address: "Cite Somacob" },
      { name: "مكتب باتنة 05", wilaya: 5, address: "Hay El Riadh" },
      { name: "Hub Ain El Beida 04", wilaya: 4, address: "cite el Amal" },
      { name: "مكتب تنس 02", wilaya: 2, address: "Rue Boufadis" },
      { name: "مكتب أدرار 01", wilaya: 1, address: "Cite 140 Logements" }
    ];

    const officeSelectGroup  = document.getElementById('office-select-group');
    const homeAddressGroup    = document.getElementById('home-address-group');
    const officeSelect        = document.getElementById('checkout-office');
    const addressInput        = document.getElementById('checkout-address');
    const wilayaSelectEl      = document.getElementById('checkout-wilaya');
    const deliveryRadioEls    = document.querySelectorAll('input[name="delivery-type"]');

    function updateOfficesDropdown() {
      const selectedWilaya = wilayaSelectEl.value;
      if (!selectedWilaya) {
        officeSelect.innerHTML = '<option value="" disabled selected>يرجى اختيار الولاية أولاً...</option>';
        return;
      }
      const wilayaCode = parseInt(selectedWilaya);
      const filtered = ZR_OFFICES.filter(off => off.wilaya === wilayaCode);

      if (filtered.length === 0) {
        officeSelect.innerHTML = '<option value="" disabled selected>لا توجد مكاتب توصيل متوفرة في هذه الولاية</option>';
      } else {
        let optionsHtml = '<option value="" disabled selected>اختر مكتب التوصيل...</option>';
        filtered.forEach(off => {
          const displayText = `${off.name} - (${off.address})`;
          optionsHtml += `<option value="${displayText}">${displayText}</option>`;
        });
        officeSelect.innerHTML = optionsHtml;
      }
    }

    // إظهار/إخفاء الحقول بحسب نوع التوصيل
    function updateDeliveryFields(type) {
      if (type === 'office') {
        homeAddressGroup.style.display  = 'none';
        officeSelectGroup.style.display = 'flex';
        if (addressInput) addressInput.removeAttribute('required');
        updateOfficesDropdown();
      } else {
        homeAddressGroup.style.display  = 'flex';
        officeSelectGroup.style.display = 'none';
        if (addressInput) addressInput.setAttribute('required', '');
      }
    }

    deliveryRadioEls.forEach(radio => {
      radio.addEventListener('change', (e) => {
        updateDeliveryFields(e.target.value);
        updateCartUI();
        if (window.updateDeliveryPriceDisplay) window.updateDeliveryPriceDisplay();
      });
    });

    wilayaSelectEl.addEventListener('change', () => {
      const activeDeliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
      if (activeDeliveryType === 'office') updateOfficesDropdown();
      updateCartUI();
      if (window.updateDeliveryPriceDisplay) window.updateDeliveryPriceDisplay();
    });

    checkoutForm.addEventListener('reset', () => {
      // العودة لحالة توصيل منزل بعد الإعادة
      setTimeout(() => updateDeliveryFields('home'), 0);
      const errOffice  = document.getElementById('err-office');
      const errAddress = document.getElementById('err-address');
      const errName    = document.getElementById('err-name');
      const errSurname = document.getElementById('err-surname');
      const nameInput = document.getElementById('checkout-name');
      const surnameInput = document.getElementById('checkout-surname');

      if (errOffice)  { errOffice.classList.remove('show');  officeSelect.style.borderColor = ''; }
      if (errAddress) { errAddress.classList.remove('show'); if (addressInput) addressInput.style.borderColor = ''; }
      if (errName)    { errName.classList.remove('show');    nameInput.style.borderColor = ''; }
      if (errSurname) { errSurname.classList.remove('show'); if (surnameInput) surnameInput.style.borderColor = ''; }
    });

    // تطبيق الحالة الافتراضية (توصيل للمنزل محدد افتراضياً)
    updateDeliveryFields('home');

    // التكوين الخاص بالتنبيهات المجانية (تعديل هذه القيم بالبيانات الخاصة بك)
    const NOTIFICATION_CONFIG = {
      // إعدادات Telegram Bot
      telegram: {
        enabled: false, // اجعلها true لتفعيل إرسال التنبيهات إلى تلغرام
        botToken: 'YOUR_TELEGRAM_BOT_TOKEN', // رمز البوت من BotFather
        chatId: 'YOUR_TELEGRAM_CHAT_ID'      // معرف الشات الخاص بك
      },
      // إعدادات EmailJS
      emailjs: {
        enabled: false, // اجعلها true لتفعيل إرسال التنبيهات للإيميل
        serviceId: 'YOUR_EMAILJS_SERVICE_ID',
        templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
        publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'
      },
      // إعدادات WhatsApp عبر CallMeBot (إرسال تلقائي في الخلفية)
      whatsapp: {
        enabled: true, // اجعلها true لتفعيل التنبيهات التلقائية إلى واتساب الخاص بك
        phone: '+213655349311', // رقم الواتساب الخاص بك المكون من رمز الدولة والرقم
        apiKey: 'YOUR_CALLMEBOT_API_KEY' // كود الـ API الخاص بك من CallMeBot للحصول عليه راسل البوت
      }
    };

    // دالة إرسال الإشعار إلى تلغرام
    async function sendTelegramNotification(order) {
      if (!NOTIFICATION_CONFIG.telegram.enabled) return;
      
      const token = NOTIFICATION_CONFIG.telegram.botToken;
      const chatId = NOTIFICATION_CONFIG.telegram.chatId;
      if (token === 'YOUR_TELEGRAM_BOT_TOKEN' || !token) return;

      const itemsText = order.items.map(item => `- ${item.name} (مقاس: ${item.size || 'افتراضي'}) x${item.quantity}`).join('\n');
      
      const message = `🔔 *طلب جديد وارد!*
      
📦 *رقم الطلب:* #${order.id}
👤 *العميل:* ${order.customer.name}
📞 *الهاتف:* ${order.customer.phone}
📍 *الولاية:* ${order.customer.wilaya}
🚚 *التوصيل:* ${order.customer.delivery}

🛒 *المنتجات:*
${itemsText}

💰 *الإجمالي:* ${order.total.toLocaleString()} DZD`;

      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
        console.log('Telegram notification sent successfully.');
      } catch (err) {
        console.error('Error sending Telegram notification:', err);
      }
    }

    // دالة إرسال الإشعار إلى البريد الإلكتروني عبر EmailJS
    async function sendEmailJSNotification(order) {
      if (!NOTIFICATION_CONFIG.emailjs.enabled) return;
      
      const { serviceId, templateId, publicKey } = NOTIFICATION_CONFIG.emailjs;
      if (serviceId === 'YOUR_EMAILJS_SERVICE_ID' || !serviceId) return;

      const itemsText = order.items.map(item => `${item.name} (${item.size || 'default'}) x${item.quantity}`).join(', ');

      const templateParams = {
        order_id: order.id,
        customer_name: order.customer.name,
        customer_phone: order.customer.phone,
        customer_wilaya: order.customer.wilaya,
        delivery_type: order.customer.delivery,
        order_items: itemsText,
        total_price: `${order.total.toLocaleString()} DZD`
      };

      try {
        // تهيئة EmailJS بالمفتاح العام
        emailjs.init({ publicKey: publicKey });
        await emailjs.send(serviceId, templateId, templateParams);
        console.log('EmailJS notification sent successfully.');
      } catch (err) {
        console.error('Error sending EmailJS notification:', err);
      }
    }

    // دالة إرسال الإشعار إلى الواتساب الخاص بك تلقائياً عبر خدمة CallMeBot
    async function sendWhatsAppNotification(order) {
      if (!NOTIFICATION_CONFIG.whatsapp.enabled) return;
      
      const { phone, apiKey } = NOTIFICATION_CONFIG.whatsapp;
      if (apiKey === 'YOUR_CALLMEBOT_API_KEY' || !apiKey) {
        console.warn('CallMeBot API Key is not set. Please get it from CallMeBot.');
        return;
      }

      const itemsText = order.items.map((item, idx) => {
        return `${idx + 1}. *${item.name}* ${item.size ? `(المقاس: ${item.size})` : ''} - العدد: ${item.quantity} - السعر: ${(item.price * item.quantity).toLocaleString()} DZD`;
      }).join('\n');

      const message = `🔔 *طلب جديد وارد من الموقع!*

📌 *رقم الطلب:* #${order.id}
👤 *العميل:* ${order.customer.name}
📞 *الهاتف:* ${order.customer.phone}
📍 *الولاية:* ${order.customer.wilaya}
🚚 *التوصيل:* ${order.customer.delivery}

📦 *المنتجات المطلوبة:*
${itemsText}

💵 *المجموع الفرعي:* ${order.subtotal.toLocaleString()} DZD
🚚 *تكلفة الشحن:* ${order.shipping.toLocaleString()} DZD
💰 *الإجمالي الكلي:* *${order.total.toLocaleString()} DZD*

شكراً!`;

      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;

      try {
        await fetch(url, {
          method: 'GET',
          mode: 'no-cors' // لمنع مشاكل الـ CORS في المتصفح وتأكيد وصول الطلب للسيرفر
        });
        console.log('WhatsApp notification sent successfully via CallMeBot.');
      } catch (err) {
        console.error('Error sending WhatsApp notification via CallMeBot:', err);
      }
    }

    async function saveOrderToCloud(newOrder) {
      const apiUrl = (window.API_BASE_URL || '') + '/api/orders';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Server error: ' + res.status);
      }
      return data;
    }

    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Inputs
      const nameInput = document.getElementById('checkout-name');
      const surnameInput = document.getElementById('checkout-surname');
      const phoneInput = document.getElementById('checkout-phone');
      const wilayaSelect = document.getElementById('checkout-wilaya');
      const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;

      // Error fields
      const errName = document.getElementById('err-name');
      const errSurname = document.getElementById('err-surname');
      const errPhone = document.getElementById('err-phone');
      const errWilaya = document.getElementById('err-wilaya');

      let isValid = true;

      // Validate Name (First Name)
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        errName.classList.add('show');
        nameInput.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        errName.classList.remove('show');
        nameInput.style.borderColor = '';
      }

      // Validate Surname (Last Name)
      if (!surnameInput || !surnameInput.value.trim() || surnameInput.value.trim().length < 2) {
        if (errSurname) errSurname.classList.add('show');
        if (surnameInput) surnameInput.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        if (errSurname) errSurname.classList.remove('show');
        if (surnameInput) surnameInput.style.borderColor = '';
      }

      // Validate Phone (Algerian format check: 05, 06, 07 followed by 8 digits)
      const phoneClean = phoneInput.value.trim().replace(/\s+/g, '');
      const phoneRegex = /^(05|06|07)\d{8}$/;
      if (!phoneRegex.test(phoneClean)) {
        errPhone.classList.add('show');
        phoneInput.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        errPhone.classList.remove('show');
        phoneInput.style.borderColor = '';
      }

      // Validate Wilaya
      if (!wilayaSelect.value) {
        errWilaya.classList.add('show');
        wilayaSelect.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        errWilaya.classList.remove('show');
        wilayaSelect.style.borderColor = '';
      }

      // Validate Home Address
      const errAddress = document.getElementById('err-address');
      if (deliveryType === 'home') {
        if (!addressInput || !addressInput.value.trim() || addressInput.value.trim().length < 5) {
          errAddress.classList.add('show');
          if (addressInput) addressInput.style.borderColor = '#ef4444';
          isValid = false;
        } else {
          errAddress.classList.remove('show');
          if (addressInput) addressInput.style.borderColor = '';
        }
      } else {
        if (errAddress) errAddress.classList.remove('show');
      }

      // Validate Office if selected delivery is Office
      const errOffice = document.getElementById('err-office');
      if (deliveryType === 'office') {
        if (!officeSelect.value) {
          errOffice.classList.add('show');
          officeSelect.style.borderColor = '#ef4444';
          isValid = false;
        } else {
          errOffice.classList.remove('show');
          officeSelect.style.borderColor = '';
        }
      } else {
        if (errOffice) {
          errOffice.classList.remove('show');
          officeSelect.style.borderColor = '';
        }
      }

      if (isValid) {
        // Create order
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const _wCode = parseInt(wilayaSelect.value) || 0;
        const shipping = window.getShippingCost ? window.getShippingCost(_wCode, deliveryType) : 600;
        const total = subtotal + shipping;
        const orderId = 'AZ-' + Math.floor(1000 + Math.random() * 9000);
        const homeAddress = addressInput ? addressInput.value.trim() : '';

        const order = {
          id: orderId,
          date: new Date().toISOString(),
          customer: {
            name: `${nameInput.value.trim()} ${surnameInput.value.trim()}`,
            firstName: nameInput.value.trim(),
            surname: surnameInput.value.trim(),
            fullName: `${nameInput.value.trim()} ${surnameInput.value.trim()}`,
            phone: phoneClean,
            wilaya: wilayaSelect.value,
            address: deliveryType === 'home' ? homeAddress : null,
            delivery: deliveryType === 'home'
              ? `التوصيل إلى المنزل (A DOMICILE) — ${homeAddress}`
              : `التوصيل إلى المكتب (STOP DESK) - ${officeSelect.value}`
          },
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            color: item.color || "أسود",
            size: item.size || "M",
            quantity: item.quantity
          })),
          subtotal: subtotal,
          shipping: shipping,
          total: total,
          status: 'Pending'
        };

        const confirmBtn = document.getElementById('btn-confirm-order');
        const originalBtnText = confirmBtn.textContent;
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'جاري إرسال الطلب... / Sending...';

        try {
          // 1. Save to cloud first (synchronous check)
          try {
            await saveOrderToCloud(order);
            order.synced = true;
          } catch (apiErr) {
            console.warn('Backend server is offline or returned an error, saving order locally in localStorage:', apiErr);
            order.synced = false;

            // 2. Save to localStorage ONLY if sync failed
            let localOrders = [];
            try {
              localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
            } catch(e) {
              console.error('Error parsing local orders:', e);
            }
            localOrders.push(order);
            localStorage.setItem('local_orders', JSON.stringify(localOrders));
          }

          // 3. Show Success Screen
          document.getElementById('success-order-id').textContent = `#${orderId}`;
          document.getElementById('success-order-name').textContent = order.customer.name;
          document.getElementById('success-order-phone').textContent = order.customer.phone;
          document.getElementById('success-order-wilaya').textContent = order.customer.wilaya;
          document.getElementById('success-order-delivery').textContent = order.customer.delivery;
          document.getElementById('success-order-total').textContent = `${total.toLocaleString()} DZD`;

          // Clear Cart & Reset UI
          cart = [];
          saveCart();
          updateCartUI();

          // UI screen toggle
          cartCheckoutSection.style.display = 'none';
          orderSuccessScreen.style.display = 'block';

          // Reset form inputs
          checkoutForm.reset();

          // Send notifications asynchronously
          try { sendTelegramNotification(order).catch(e=>{}); } catch(e){}
          try { sendEmailJSNotification(order).catch(e=>{}); } catch(e){}
          try { sendWhatsAppNotification(order).catch(e=>{}); } catch(e){}

        } catch (err) {
          console.error('Checkout failed:', err);
          // Show error message in UI instead of alert
          const errorAlert = document.getElementById('checkout-error-alert');
          const errorText = document.getElementById('checkout-error-text');
          
          let errorMessage = 'حدث خطأ أثناء معالجة الطلب';
          if (err.message.includes('Server error') || err.message.includes('offline')) {
            errorMessage = '⚠️ تعذّر الاتصال بالخادم. يرجى التأكد من تشغيل السيرفر أو محاولة لاحقاً.';
          } else if (err.message.includes('ZR')) {
            errorMessage = '⚠️ حدث خطأ عند الاتصال بـ ZR Express. يرجى محاولة تحديد طريقة توصيل أخرى.';
          } else {
            errorMessage = err.message || '⚠️ تعذّر معالجة الطلب. يرجى التحقق من البيانات المدخلة.';
          }
          
          errorText.textContent = errorMessage;
          errorAlert.style.display = 'flex';
          
          // Auto-hide error after 5 seconds or when user clicks close
          setTimeout(() => {
            if (errorAlert.style.display === 'flex') {
              errorAlert.style.display = 'none';
            }
          }, 5000);
        } finally {
          confirmBtn.disabled = false;
          confirmBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // Close success window
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => {
      orderSuccessScreen.style.display = 'none';
      cartEmptyState.style.display = 'flex';
      closeCart();
    });
  }

  /* ────────────────────────────────────────
     9. LEAD COLLECTION POPUP
     ──────────────────────────────────────── */
  const leadPopup = document.getElementById('lead-popup');
  const leadBackdrop = document.getElementById('lead-popup-backdrop');
  const btnCloseLeadPopup = document.getElementById('btn-close-lead-popup');
  const leadForm = document.getElementById('lead-popup-form');
  const leadEmailInput = document.getElementById('lead-email');
  const leadSuccess = document.getElementById('lead-popup-success');
  const errLeadEmail = document.getElementById('err-lead-email');

  // Math Captcha for popup
  let leadCaptchaVal = 0;
  const initLeadCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    leadCaptchaVal = a + b;
    const qEl = document.getElementById('lead-captcha-question');
    if (qEl) qEl.textContent = `${a} + ${b} =`;
    const ansEl = document.getElementById('lead-captcha-answer');
    if (ansEl) ansEl.value = '';
  };

  const openLeadPopup = () => {
    if (!leadPopup) return;
    initLeadCaptcha();
    leadPopup.style.display = 'flex';
    leadBackdrop.classList.add('active');
    setTimeout(() => leadPopup.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
  };

  const closeLeadPopup = () => {
    if (!leadPopup) return;
    leadPopup.classList.remove('active');
    leadBackdrop.classList.remove('active');
    setTimeout(() => {
      leadPopup.style.display = 'none';
      document.body.style.overflow = '';
    }, 400);
    localStorage.setItem('aizo_lead_popup_seen', 'true');
  };

  // Show popup after 1 second if not seen before
  if (!localStorage.getItem('aizo_lead_popup_seen')) {
    setTimeout(openLeadPopup, 1000);
  }

  if (btnCloseLeadPopup) {
    btnCloseLeadPopup.addEventListener('click', closeLeadPopup);
  }
  if (leadBackdrop) {
    leadBackdrop.addEventListener('click', closeLeadPopup);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && leadPopup && leadPopup.classList.contains('active')) {
      closeLeadPopup();
    }
  });

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const captchaAns = parseInt(document.getElementById('lead-captcha-answer').value, 10);
      if (captchaAns !== leadCaptchaVal) {
        alert('⚠️ التحقق من كود الأمان غير صحيح / CAPTCHA incorrect');
        initLeadCaptcha();
        return;
      }

      const email = leadEmailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        errLeadEmail.classList.add('show');
        leadEmailInput.style.borderColor = '#ef4444';
        return;
      }
      errLeadEmail.classList.remove('show');
      leadEmailInput.style.borderColor = '';

      const formAction = leadForm.getAttribute('action') || '';
      const isFormspreeConfigured = formAction.includes('formspree.io') && !formAction.includes('YOUR_FORMSPREE_ID');

      if (isFormspreeConfigured) {
        // Send email direct to Formspree (External - no storage on local server/Netlify)
        try {
          const res = await fetch(formAction, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
          });
          if (!res.ok) throw new Error('Formspree response not OK');
        } catch (err) {
          console.error('Failed to submit to Formspree:', err);
          alert('⚠️ حدث خطأ أثناء الاشتراك. يرجى المحاولة لاحقاً.');
          return;
        }
      } else {
        // Fallback or development mode: save to local backend/localStorage
        const leadData = { email, date: new Date().toISOString() };
        try {
          const apiUrl = (window.API_BASE_URL || '') + '/api/leads';
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
          });
          if (!res.ok) throw new Error('API response not OK');
        } catch (err) {
          console.warn('Lead could not be saved to server, saving to localStorage:', err);
          let localLeads = [];
          try {
            localLeads = JSON.parse(localStorage.getItem('local_leads') || '[]');
          } catch(e) {
            console.error(e);
          }
          if (!localLeads.some(l => l.email === email)) {
            localLeads.push(leadData);
            localStorage.setItem('local_leads', JSON.stringify(localLeads));
          }
        }
      }

      // Show success
      leadForm.style.display = 'none';
      leadSuccess.style.display = 'flex';
      localStorage.setItem('aizo_lead_popup_seen', 'true');

      setTimeout(closeLeadPopup, 2500);
    });
  }

  // Initialize language from localStorage or browser default
  if (window.setLanguage) {
    const savedLang = localStorage.getItem('aizo_lang') || 'fr';
    window.setLanguage(savedLang);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}


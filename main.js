/* ==========================================================================
   GLOBAL APP STATE
   ========================================================================== */
const AppState = {
  cart: [],
  heroProducts: {
    'starter-kit': {
      title: 'Matcha Starter Kit',
      description: 'Everything you need to begin your home matcha ritual: bamboo whisk, stoneware chawan mug, and a starter canister of stone-ground ceremonial Uji powder.',
      price: '25.00',
      weight: 'Complete Bundle',
      img: 'assets/matcha_starter_kit.png',
      id: 'starter-kit-bundle'
    },
    'ceremonial': {
      title: 'Premium Matcha',
      description: 'Our standard-bearer shade-grown tencha green tea, stone-ground to a velvet powder. Incredibly vibrant, smooth, and naturally sweet.',
      price: '28.00',
      weight: 'Net Wt. 30g',
      img: 'assets/hero_matcha_bowl.png',
      id: 'premium-matcha-30g'
    },
    'latte-mix': {
      title: 'Matcha Latte Mix',
      description: 'Our house-crafted matcha powder blended with organic coconut sugar. Designed to whisk smoothly and create rich, creamy lattes in seconds.',
      price: '19.00',
      weight: 'Net Wt. 150g',
      img: 'Matcha Latte JPG images/ezgif-frame-100.jpg',
      id: 'matcha-latte-mix'
    }
  },
  collectionProducts: {
    'ceremonial': {
      title: 'Ceremonial Grade Matcha',
      grade: 'Ceremonial Grade',
      price: '32.00',
      desc: 'Picked during the spring harvest (first flush), this shade-grown matcha is ground slowly by stone. Features a sweet creaminess and a brilliant emerald tone.',
      img: 'assets/ceremonial_grade_matcha.png',
      id: 'ceremonial-matcha'
    },
    'culinary': {
      title: "Chef's Blend Matcha",
      grade: 'Culinary Grade',
      price: '18.00',
      desc: 'Sourced from the second flush harvest, this blend features a robust green tea flavor that cuts through milk and sugar, making it ideal for baking and lattes.',
      img: 'assets/matcha_cake_powder.png',
      id: 'matcha-cake-powder'
    },
    'daily': {
      title: 'Daily Ritual Matcha',
      grade: 'Premium Daily',
      price: '24.00',
      desc: 'A well-rounded premium grade matcha that balances rich umami notes with a very mild astringency. Ideal for daily tea drinking, whisks beautifully into a light froth.',
      img: 'assets/hero_matcha_bowl.png',
      id: 'daily-ritual-matcha'
    }
  }
};

/* ==========================================================================
   INITIALIZATION & EVENT LISTENERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initHeroSwapper();
  initStarterKitHotspots();
  initCollectionSwapper();
  initQuantityControls();
  initCartDrawer();
  initCanvasAnimation();
  initRevealOnScroll();
});

/* ==========================================================================
   1) HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2) HERO PRODUCT SWITCHER
   ========================================================================== */
function initHeroSwapper() {
  const thumbs = document.querySelectorAll('.hero-thumbnails-row .thumb-card');
  const heroMainImg = document.querySelector('.hero-main-image');
  const rightColTitle = document.querySelector('.hero-product-highlight .highlight-title');
  const rightColDesc = document.querySelector('.hero-product-highlight .highlight-description');
  const rightColWeight = document.querySelector('.hero-product-highlight .weight-tag');
  const rightColPrice = document.querySelector('.hero-product-highlight .price-tag');
  const rightColBtn = document.querySelector('.hero-product-highlight .add-to-cart-action');

  thumbs.forEach(thumb => {
    thumb.addEventListener('mouseenter', () => {
      // Active states
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const productKey = thumb.getAttribute('data-product');
      const prod = AppState.heroProducts[productKey];

      if (prod) {
        // Fade effect
        heroMainImg.style.opacity = 0;
        heroMainImg.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          heroMainImg.src = prod.img;
          heroMainImg.style.opacity = 1;
          heroMainImg.style.transform = 'scale(1)';
        }, 200);

        // Update details
        rightColTitle.textContent = prod.title;
        rightColDesc.textContent = prod.description;
        rightColWeight.textContent = prod.weight;
        rightColPrice.textContent = `$${Math.floor(prod.price)}`;

        // Update button attributes
        rightColBtn.setAttribute('data-id', prod.id);
        rightColBtn.setAttribute('data-name', prod.title);
        rightColBtn.setAttribute('data-price', prod.price);
        rightColBtn.setAttribute('data-img', prod.img);
      }
    });
  });
}

/* ==========================================================================
   3) STARTER KIT HOTSPOTS
   ========================================================================== */
function initStarterKitHotspots() {
  const hotspots = document.querySelectorAll('.hotspot-dot');

  // Desktop hover is already styled in CSS, but mobile tap is supported here
  hotspots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = dot.classList.contains('active');
      hotspots.forEach(d => d.classList.remove('active'));
      if (!isActive) {
        dot.classList.add('active');
      }
    });
  });

  document.addEventListener('click', () => {
    hotspots.forEach(d => d.classList.remove('active'));
  });
}

/* ==========================================================================
   4) PRODUCT COLLECTION GRADIENT SWITCHER
   ========================================================================== */
function initCollectionSwapper() {
  const miniCards = document.querySelectorAll('.mini-product-card');
  const featuredImg = document.getElementById('featured-card-image');
  const featuredGrade = document.getElementById('featured-card-grade');
  const featuredTitle = document.getElementById('featured-card-title');
  const featuredPrice = document.getElementById('featured-card-price');
  const featuredDesc = document.getElementById('featured-card-desc');
  const featuredBtn = document.getElementById('featured-add-to-cart-btn');

  miniCards.forEach(card => {
    card.addEventListener('click', () => {
      miniCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const targetKey = card.getAttribute('data-target');
      const prod = AppState.collectionProducts[targetKey];

      if (prod) {
        // Animate swap
        featuredImg.style.opacity = 0;
        featuredImg.style.transform = 'translateY(10px)';

        setTimeout(() => {
          featuredImg.src = prod.img;
          featuredImg.style.opacity = 1;
          featuredImg.style.transform = 'translateY(0)';
        }, 250);

        // Update fields
        featuredGrade.textContent = prod.grade;
        featuredTitle.textContent = prod.title;
        featuredPrice.textContent = `$${Math.floor(prod.price)}`;
        featuredDesc.textContent = prod.desc;

        // Button attributes
        featuredBtn.setAttribute('data-id', prod.id);
        featuredBtn.setAttribute('data-name', prod.title);
        featuredBtn.setAttribute('data-price', prod.price);
        featuredBtn.setAttribute('data-img', prod.img);
      }
    });
  });
}

/* ==========================================================================
   5) QUANTITY CONTROLS (FEATURED PRODUCT CARD)
   ========================================================================== */
function initQuantityControls() {
  const qtyInput = document.querySelector('.qty-input');
  const plusBtn = document.querySelector('.plus-btn');
  const minusBtn = document.querySelector('.minus-btn');

  if (qtyInput && plusBtn && minusBtn) {
    plusBtn.addEventListener('click', () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });

    minusBtn.addEventListener('click', () => {
      const val = parseInt(qtyInput.value);
      if (val > 1) {
        qtyInput.value = val - 1;
      }
    });
  }
}

/* ==========================================================================
   6) SHOPPING CART DRAWER SYSTEM
   ========================================================================== */
function initCartDrawer() {
  const cartTrigger = document.getElementById('cart-trigger-btn');
  const closeCart = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const badge = document.getElementById('cart-count-badge');

  // Toggle Cart Drawer Open/Close
  const toggleCart = () => {
    cartDrawer.classList.toggle('open');
    cartOverlay.classList.toggle('open');
  };

  cartTrigger.addEventListener('click', toggleCart);
  closeCart.addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);

  // Hook all Add To Cart action buttons dynamically
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-action');
    if (btn) {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');
      
      // Determine quantity (if inside featured product card, look at quantity selector)
      let quantity = 1;
      if (btn.id === 'featured-add-to-cart-btn') {
        const qtySelector = document.querySelector('.qty-input');
        if (qtySelector) {
          quantity = parseInt(qtySelector.value);
        }
      }

      addToCart(id, name, price, img, quantity);

      // Animate badge
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => {
        badge.style.transform = 'scale(1)';
      }, 300);

      // Auto-open cart drawer as confirmation
      if (!cartDrawer.classList.contains('open')) {
        toggleCart();
      }
    }
  });
}

function addToCart(id, name, price, img, quantity) {
  const existingItemIndex = AppState.cart.findIndex(item => item.id === id);

  if (existingItemIndex > -1) {
    AppState.cart[existingItemIndex].quantity += quantity;
  } else {
    AppState.cart.push({ id, name, price, img, quantity });
  }

  renderCart();
}

function changeCartQty(id, delta) {
  const itemIndex = AppState.cart.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    AppState.cart[itemIndex].quantity += delta;
    if (AppState.cart[itemIndex].quantity <= 0) {
      AppState.cart.splice(itemIndex, 1);
    }
    renderCart();
  }
}

function removeCartItem(id) {
  AppState.cart = AppState.cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceContainer = document.getElementById('cart-total-price');
  const badge = document.getElementById('cart-count-badge');

  // Empty content
  cartItemsContainer.innerHTML = '';

  if (AppState.cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty. Start your matcha ritual today.</div>';
    totalPriceContainer.textContent = '$0.00';
    badge.textContent = '0';
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;

  AppState.cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';
    itemRow.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <span class="price">$${Math.floor(item.price)}</span>
      </div>
      <div class="cart-item-controls">
        <div class="cart-qty-selector">
          <button class="cart-qty-btn cart-qty-minus" data-id="${item.id}">-</button>
          <input type="number" class="cart-qty-input" value="${item.quantity}" readonly>
          <button class="cart-qty-btn cart-qty-plus" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item-btn" data-id="${item.id}">Remove</button>
      </div>
    `;

    // Bind item buttons
    itemRow.querySelector('.cart-qty-minus').addEventListener('click', () => changeCartQty(item.id, -1));
    itemRow.querySelector('.cart-qty-plus').addEventListener('click', () => changeCartQty(item.id, 1));
    itemRow.querySelector('.remove-item-btn').addEventListener('click', () => removeCartItem(item.id));

    cartItemsContainer.appendChild(itemRow);
  });

  // Update total badge and price
  badge.textContent = totalItems;
  totalPriceContainer.textContent = `$${totalPrice.toFixed(2)}`;
}

/* ==========================================================================
   7) SCROLL-TRIGGERED 100-FRAME LATTE POUR CANVAS ANIMATION
   ========================================================================== */
function initCanvasAnimation() {
  const canvas = document.getElementById('latte-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const loader = document.getElementById('canvas-loader');
  const progressText = document.getElementById('loader-progress');
  const triggerSection = document.getElementById('canvas-trigger-section');

  const totalFrames = 100;
  const images = [];
  let loadedCount = 0;

  // Generate padded frame paths
  const getFramePath = (index) => {
    const frameNum = String(index).padStart(3, '0');
    return `Matcha Latte JPG images/ezgif-frame-${frameNum}.jpg`;
  };

  // Preload all 100 frames
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    img.onload = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / totalFrames) * 100);
      progressText.textContent = percent;

      if (loadedCount === totalFrames) {
        // Finished preloading, hide spinner, render frame 0
        loader.style.opacity = 0;
        setTimeout(() => loader.style.display = 'none', 300);
        
        requestAnimationFrame(() => drawFrame(0));
        initScrollTracking();
      }
    };
    img.onerror = () => {
      // Handle loading error by moving forward
      loadedCount++;
    };
    images.push(img);
  }

  function drawFrame(frameIndex) {
    if (images[frameIndex]) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw frame fitting the canvas aspect ratio
      ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
    }
  }

  function initScrollTracking() {
    window.addEventListener('scroll', handleScrollAnimation);
    // Initial call in case footer is already on viewport
    handleScrollAnimation();
  }

  function handleScrollAnimation() {
    const rect = triggerSection.getBoundingClientRect();
    const elementHeight = rect.height;
    const windowHeight = window.innerHeight;

    // Calculate scroll progress fraction: 0 when top is at bottom of screen, 1 when bottom is at top of screen
    const progress = (windowHeight - rect.top) / (windowHeight + elementHeight);
    
    // Clamp to [0, 1]
    const scrollFraction = Math.max(0, Math.min(1, progress));
    
    // Convert to image array index (0 to 99)
    const frameIndex = Math.floor(scrollFraction * (totalFrames - 1));

    requestAnimationFrame(() => drawFrame(frameIndex));
  }
}

/* ==========================================================================
   8) REVEAL-ON-SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

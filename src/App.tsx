import React, { useState, useEffect, useRef } from 'react';
import { MatchaSequence } from './components/MatchaSequence';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// Define TS Interfaces
interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
}

interface ProductDetail {
  title: string;
  description: string;
  price: string;
  weight: string;
  img: string;
  id: string;
}

export const App: React.FC = () => {
  // Global States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Product Switcher state
  const [activeHeroKey, setActiveHeroKey] = useState<'starter-kit' | 'ceremonial' | 'latte-mix'>('ceremonial');

  // Hotspots State
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Collection State
  const [activeColKey, setActiveColKey] = useState<'ceremonial' | 'culinary' | 'daily'>('ceremonial');
  const [featuredQty, setFeaturedQty] = useState(1);

  // Product Swapper Details
  const heroProducts: Record<string, ProductDetail> = {
    'starter-kit': {
      title: 'Matcha Starter Kit',
      description: 'Everything you need to experience the meditative practice of authentic stone-ground Japanese matcha tea preparation. Handcrafted tools designed for modern wellness.',
      price: '25.00',
      weight: 'Complete Bundle',
      img: '/assets/matcha_starter_kit.png',
      id: 'starter-kit-bundle'
    },
    'ceremonial': {
      title: 'Premium Matcha',
      description: 'Our standard-bearer shade-grown tencha green tea, stone-ground to a velvet powder. Incredibly vibrant, smooth, and naturally sweet.',
      price: '28.00',
      weight: 'Net Wt. 30g',
      img: '/assets/hero_matcha_bowl.png',
      id: 'premium-matcha-30g'
    },
    'latte-mix': {
      title: 'Matcha Latte Mix',
      description: 'Our house-crafted matcha powder blended with organic coconut sugar. Creamy, subtly sweet, and whisks instantly into milk or oat water.',
      price: '19.00',
      weight: 'Net Wt. 150g',
      img: '/Matcha Latte JPG images/ezgif-frame-100.jpg',
      id: 'matcha-latte-mix'
    }
  };

  const collectionProducts = {
    'ceremonial': {
      title: 'Ceremonial Grade Matcha',
      grade: 'Ceremonial Grade',
      price: 32.00,
      desc: 'Picked during the spring harvest (first flush), this shade-grown matcha is ground slowly by stone. Features a sweet creaminess and a brilliant emerald tone.',
      img: '/assets/ceremonial_grade_matcha.png',
      id: 'ceremonial-matcha'
    },
    'culinary': {
      title: "Chef's Blend Matcha",
      grade: 'Culinary Grade',
      price: 18.00,
      desc: 'Sourced from the second flush harvest, this blend features a robust green tea flavor that cuts through milk and sugar, making it ideal for baking and lattes.',
      img: '/assets/matcha_cake_powder.png',
      id: 'matcha-cake-powder'
    },
    'daily': {
      title: 'Daily Ritual Matcha',
      grade: 'Premium Daily',
      price: 24.00,
      desc: 'A well-rounded premium grade matcha that balances rich umami notes with a very mild astringency. Ideal for daily tea drinking, whisks beautifully into a light froth.',
      img: '/assets/hero_matcha_bowl.png',
      id: 'daily-ritual-matcha'
    }
  };

  // Header Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
  }, []);

  // Hero Scroll tracking
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroScrollRef,
    offset: ['start start', 'end end']
  });

  // Parallax / Scroll animations
  const leftY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0]);


  // Intersection Observer for scroll-reveal animations
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Cart methods
  const addToCart = (id: string, name: string, price: number, img: string, quantity: number = 1) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex(item => item.id === id);
      if (idx > -1) {
        const updated = [...prevCart];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prevCart, { id, name, price, img, quantity }];
    });
    setCartOpen(true);
  };

  const changeCartQty = (id: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0);
    });
  };

  const removeCartItem = (id: string) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const activeHero = heroProducts[activeHeroKey];
  const activeCol = collectionProducts[activeColKey];

  return (
    <div className="app-wrapper" onClick={() => setActiveHotspot(null)}>

      {/* ==================== SHOPPING CART DRAWER ==================== */}
      <div 
        className={`cart-overlay ${cartOpen ? 'open' : ''}`}
        onClick={() => setCartOpen(false)}
      />
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`} id="cart-drawer">
        <div className="cart-header">
          <h3>Your Ritual Cart</h3>
          <button 
            className="close-cart-btn" 
            id="close-cart-btn"
            onClick={() => setCartOpen(false)}
          >
            &times;
          </button>
        </div>
        <div className="cart-items" id="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart-message">Your cart is empty. Start your matcha ritual today.</div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">
                  <img src={item.img} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <span className="price">${Math.floor(item.price)}</span>
                </div>
                <div className="cart-item-controls">
                  <div className="cart-qty-selector">
                    <button 
                      className="cart-qty-btn" 
                      onClick={() => changeCartQty(item.id, -1)}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      className="cart-qty-input" 
                      value={item.quantity} 
                      readOnly 
                    />
                    <button 
                      className="cart-qty-btn" 
                      onClick={() => changeCartQty(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-item-btn"
                    onClick={() => removeCartItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Subtotal</span>
            <span className="cart-total-price" id="cart-total-price">
              ${totalCartPrice.toFixed(2)}
            </span>
          </div>
          <p className="cart-tax-shipping-note">Taxes &amp; shipping calculated at checkout.</p>
          <button 
            className="checkout-btn"
            disabled={cart.length === 0}
            onClick={() => alert('Proceeding to Checkout... Thank you for choosing MATON.')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* ==================== MOBILE NAVIGATION DRAWER ==================== */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`} id="mobile-menu-drawer">
        <div className="mobile-menu-header">
          <span className="logo-wordmark">MATON</span>
          <button 
            className="close-mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(false)}
          >
            &times;
          </button>
        </div>
        <nav className="mobile-menu-nav">
          <ul>
            <li><a href="#hero" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#starter-kit" onClick={() => setMobileMenuOpen(false)}>Starter Kit</a></li>
            <li><a href="#products" onClick={() => setMobileMenuOpen(false)}>Products</a></li>
            <li><a href="#benefits" onClick={() => setMobileMenuOpen(false)}>Wellness</a></li>
            <li className="mobile-sign-in-li">
              <a href="#" className="mobile-menu-sign-in-btn" onClick={() => setMobileMenuOpen(false)}>Sign In</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* ==================== 1) HEADER & NAVIGATION ==================== */}
      <header className={`main-header ${headerScrolled ? 'scrolled' : ''}`} id="main-header">
        <div className="header-container">
          <a href="#" className="logo-wordmark">MATON</a>
          
          <nav className="center-nav">
            <ul>
              <li><a href="#hero" className="active">Home</a></li>
              <li><a href="#starter-kit">Starter Kit</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#benefits">Wellness</a></li>
            </ul>
          </nav>
          
          <div className="right-utilities">
            <a href="#" className="utility-link sign-in-btn">Sign In</a>
            <button 
              className="cart-trigger-btn" 
              id="cart-trigger-btn"
              onClick={() => setCartOpen(true)}
            >
              <span>My Cart</span>
              <span className="cart-count-badge" id="cart-count-badge">{totalCartItems}</span>
            </button>
            
            {/* Mobile Menu Toggle Button */}
            <button 
              className={`mobile-menu-toggle-btn ${mobileMenuOpen ? 'open' : ''}`}
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <span className="burger-bar" />
              <span className="burger-bar" />
              <span className="burger-bar" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2) HERO SECTION ==================== */}
      <section ref={heroScrollRef} className="hero-scroll-wrapper" id="hero">
        <div className="hero-sticky-container">
          {/* Full-bleed Canvas Background */}
          <motion.div 
            className="hero-canvas-bg-wrapper"
            style={{ opacity: bgOpacity }}
          >
            <MatchaSequence scrollYProgress={scrollYProgress} />
            <div className="hero-canvas-overlay" />
          </motion.div>

          <div className="hero-container hero-content-overlay">
            <div className="hero-grid-3col">
              
              {/* Left Column: Product Selection */}
              <motion.div 
                className="hero-col-left"
                style={{ y: leftY }}
              >
                <div className="starter-kit-offer">
                  <span className="hero-label">Curated Rituals</span>
                  <h3 className="offer-title">Select Blend</h3>
                  <p className="offer-description">
                    Click a blend to experience its authentic preparation ritual.
                  </p>
                  
                  <div className="hero-product-previews">
                    {Object.entries(heroProducts).map(([key, product]) => {
                      const isActive = activeHeroKey === key;
                      return (
                        <div 
                          key={key}
                          className={`hero-preview-card ${isActive ? 'active' : ''}`}
                          onClick={() => setActiveHeroKey(key as any)}
                        >
                          <div className="preview-card-img">
                            <img src={product.img} alt={product.title} />
                          </div>
                          <div className="preview-card-info">
                            <h4>{product.title}</h4>
                            <p>{product.weight}</p>
                          </div>
                          <span className="preview-card-price">${Math.floor(parseFloat(product.price))}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="japanese-text-badge">
                    <span>プレミアム抹茶</span>
                    <span className="badge-dot" />
                    <span>石臼挽き</span>
                  </div>
                </div>
              </motion.div>

              {/* Center Column: Interactive Showcase Card */}
              <div className="hero-col-center">
                <div className="hero-center-showcase">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeHeroKey}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                      className="hero-center-card-inner"
                    >
                      <img 
                        src={activeHero.img} 
                        alt={activeHero.title} 
                        className="hero-center-image"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Product Highlight & Large Headline */}
              <motion.div 
                className="hero-col-right"
                style={{ y: rightY }}
              >
                <div className="hero-product-highlight">
                  <h1 className="hero-right-title">
                    Best Matcha<br />In Town
                  </h1>
                  
                  <div className="hero-product-details-box">
                    <span className="hero-label">Uji, Japan</span>
                    <h3 className="highlight-title">{activeHero.title}</h3>
                    <p className="highlight-description">
                      {activeHero.description}
                    </p>
                    
                    <div className="highlight-meta">
                      <span className="weight-tag">{activeHero.weight}</span>
                      <span className="price-tag">${Math.floor(parseFloat(activeHero.price))}</span>
                    </div>
                    
                    <button 
                      className="btn btn-lime add-to-cart-action"
                      onClick={() => addToCart(activeHero.id, activeHero.title, parseFloat(activeHero.price), activeHero.img)}
                    >
                      Buy Now <i className="fa-solid fa-arrow-right" />
                    </button>
                  </div>

                  {/* Horizontal feature row */}
                  <div className="hero-feature-row">
                    <div className="feature-item">
                      <i className="fa-solid fa-leaf"></i>
                      <span className="feature-label">Shade<br />Grown</span>
                    </div>
                    <div className="feature-divider"></div>
                    <div className="feature-item">
                      <i className="fa-solid fa-mortar-pestle"></i>
                      <span className="feature-label">Stone<br />Ground</span>
                    </div>
                    <div className="feature-divider"></div>
                    <div className="feature-item">
                      <i className="fa-solid fa-shield-heart"></i>
                      <span className="feature-label">Rich in<br />Antioxidants</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>


      {/* ==================== 3) STARTER KIT FEATURE SECTION ==================== */}
      <section className="starter-kit-section" id="starter-kit">
        <div className="section-container reveal-on-scroll">
          
          <div className="starter-kit-header">
            <div className="price-anchor-wrapper">
              <span className="price-currency">$</span>
              <span className="price-amount">25</span>
            </div>
            <div className="starter-kit-header-text">
              <span className="section-subtitle">Ritual Essentials</span>
              <h2 className="section-title-serif">Matcha Starter Kits</h2>
              <p className="section-description-sans">
                Everything you need to experience the meditative practice of authentic stone-ground Japanese matcha tea preparation. Handcrafted tools designed for modern wellness.
              </p>
            </div>
          </div>

          {/* Hotspot Interactive Image Container */}
          <div className="hotspot-image-container">
            <img src="/assets/matcha_starter_kit.png" alt="MATON Matcha Starter Kit Items" className="starter-kit-main-image" />
            
            {/* Hotspot 1: Whisk */}
            <div 
              className={`hotspot-dot ${activeHotspot === 'whisk' ? 'active' : ''}`}
              id="hotspot-whisk" 
              style={{ top: '48%', left: '16%' }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === 'whisk' ? null : 'whisk');
              }}
            >
              <div className="pulse-ring" />
              <div className="dot-inner" />
              <div className="hotspot-tooltip">
                <h4>Chasen (100-Tine Whisk)</h4>
                <p>Hand-carved from a single piece of organic bamboo. 100 fine tines produce the perfect, velvet-smooth matcha froth.</p>
              </div>
            </div>

            {/* Hotspot 2: Ceremonial Bowl */}
            <div 
              className={`hotspot-dot ${activeHotspot === 'mug' ? 'active' : ''}`}
              id="hotspot-mug" 
              style={{ top: '25%', left: '52%' }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === 'mug' ? null : 'mug');
              }}
            >
              <div className="pulse-ring" />
              <div className="dot-inner" />
              <div className="hotspot-tooltip">
                <h4>Chawan (Ceramic Mug)</h4>
                <p>Artisan-fired ceramic mug with a warm, earthy glaze. Designed to cradle in both hands, retaining optimal temperature.</p>
              </div>
            </div>

            {/* Hotspot 3: Matcha Powder */}
            <div 
              className={`hotspot-dot ${activeHotspot === 'powder' ? 'active' : ''}`}
              id="hotspot-powder" 
              style={{ top: '68%', left: '66%' }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === 'powder' ? null : 'powder');
              }}
            >
              <div className="pulse-ring" />
              <div className="dot-inner" />
              <div className="hotspot-tooltip">
                <h4>Uji Ceremonial Powder</h4>
                <p>100% organic tencha leaves, shade-grown and stone-ground in Kyoto. Rich in L-Theanine and antioxidants.</p>
              </div>
            </div>
          </div>

          {/* Mobile Hotspot Detail Card */}
          {activeHotspot && (
            <div className="hotspot-mobile-details-card">
              {activeHotspot === 'whisk' && (
                <>
                  <h4>Chasen (100-Tine Whisk)</h4>
                  <p>Hand-carved from a single piece of organic bamboo. 100 fine tines produce the perfect, velvet-smooth matcha froth.</p>
                </>
              )}
              {activeHotspot === 'mug' && (
                <>
                  <h4>Chawan (Ceramic Mug)</h4>
                  <p>Artisan-fired ceramic mug with a warm, earthy glaze. Designed to cradle in both hands, retaining optimal temperature.</p>
                </>
              )}
              {activeHotspot === 'powder' && (
                <>
                  <h4>Uji Ceremonial Powder</h4>
                  <p>100% organic tencha leaves, shade-grown and stone-ground in Kyoto. Rich in L-Theanine and antioxidants.</p>
                </>
              )}
            </div>
          )}

          <div className="starter-kit-action-bar">
            <button 
              className="btn btn-dark"
              onClick={() => addToCart('starter-kit-bundle', 'Matcha Starter Kit', 25.00, '/assets/matcha_starter_kit.png')}
            >
              Acquire Starter Kit — $25
            </button>
          </div>

        </div>
      </section>

      {/* ==================== 4) BENEFITS / LIFESTYLE SECTION ==================== */}
      <section className="benefits-section" id="benefits">
        <div className="section-container">
          
          <div className="benefits-top-grid reveal-on-scroll">
            <div className="benefits-text-block">
              <span className="section-subtitle">Mindful Energy</span>
              <h2 className="section-title-serif">Experience Wellness with Every Sip</h2>
              <p className="section-description-sans">
                Unlike the jittery spike and crash of coffee, matcha delivers a clean, sustained energy release. By shade-growing the tea leaves, we preserve the highest levels of L-Theanine, an amino acid that promotes calm focus and mental clarity.
              </p>
              <div className="brand-values-row">
                <div className="value-item">
                  <span className="value-number">100%</span>
                  <span className="value-label">Organic Uji</span>
                </div>
                <div className="value-item">
                  <span className="value-number">6h</span>
                  <span className="value-label">Jitter-Free Focus</span>
                </div>
              </div>
            </div>

            <div className="benefits-image-tiles">
              <div className="benefit-tile">
                <img src="/assets/benefit_antioxidant.png" alt="Matcha being whisked representing Antioxidants" />
                <div className="tile-overlay" />
                <div className="tile-content">
                  <span className="tile-label">Antioxidant Rich</span>
                  <p className="tile-text">Contains 137x more catechins than standard brewed green tea, strengthening cell defenses.</p>
                </div>
              </div>

              <div className="benefit-tile">
                <img src="/assets/benefit_relax.png" alt="Person cradling matcha cup representing Relax and Focus" />
                <div className="tile-overlay" />
                <div className="tile-content">
                  <span className="tile-label">Relax &amp; Focus</span>
                  <p className="tile-text">Rich in L-Theanine to increase alpha waves in the brain, fostering calm alertness.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="benefits-features-row reveal-on-scroll">
            <div className="feature-col">
              <div className="feature-icon-wrapper">
                <i className="fa-solid fa-leaf" />
              </div>
              <h4>Rich Flavor &amp; Vibrant Color</h4>
              <p>Electric jade color indicating high chlorophyll. Umami-forward flavor profile with a natural sweet finish.</p>
            </div>

            <div className="feature-col">
              <div className="feature-icon-wrapper">
                <i className="fa-solid fa-building-columns" />
              </div>
              <h4>Authentic Japanese Matcha</h4>
              <p>Directly sourced from heritage family estates in Uji, Kyoto. Cultivated using traditional soil methods.</p>
            </div>

            <div className="feature-col">
              <div className="feature-icon-wrapper">
                <i className="fa-solid fa-heart-pulse" />
              </div>
              <h4>Health &amp; Sustainability</h4>
              <p>100% shade-grown leaves ground at slow speeds to preserve molecular health, packaged in eco-tins.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== 5) PRODUCT COLLECTION SECTION ==================== */}
      <section className="collection-section" id="products">
        <div className="section-container">
          
          <div className="collection-header reveal-on-scroll">
            <h2 className="section-title-serif text-center">Discover the World of Matcha</h2>
            <p className="section-description-sans text-center">
              Whether you are starting your matcha path or seek a ceremonial experience, discover our curated collection.
            </p>
          </div>

          <div className="collection-grid reveal-on-scroll">
            
            {/* Left Column Stack */}
            <div className="mini-cards-stack">
              <div 
                className={`mini-product-card ${activeColKey === 'ceremonial' ? 'active' : ''}`}
                onClick={() => {
                  setActiveColKey('ceremonial');
                  setFeaturedQty(1);
                }}
              >
                <div className="mini-card-text">
                  <span className="mini-card-grade">Ceremonial Grade</span>
                  <h4>Uji Supreme Matcha</h4>
                  <p>Delicate, cream-like body with zero bitterness.</p>
                </div>
                <span className="mini-card-price">$32</span>
              </div>

              <div 
                className={`mini-product-card ${activeColKey === 'culinary' ? 'active' : ''}`}
                onClick={() => {
                  setActiveColKey('culinary');
                  setFeaturedQty(1);
                }}
              >
                <div className="mini-card-text">
                  <span className="mini-card-grade">Culinary Grade</span>
                  <h4>Chef's Blend Matcha</h4>
                  <p>Robust green tea flavor, perfect for lattes &amp; baking.</p>
                </div>
                <span className="mini-card-price">$18</span>
              </div>

              <div 
                className={`mini-product-card ${activeColKey === 'daily' ? 'active' : ''}`}
                onClick={() => {
                  setActiveColKey('daily');
                  setFeaturedQty(1);
                }}
              >
                <div className="mini-card-text">
                  <span className="mini-card-grade">Premium Daily</span>
                  <h4>Daily Ritual Matcha</h4>
                  <p>Balanced umami and mild astringency for daily sips.</p>
                </div>
                <span className="mini-card-price">$24</span>
              </div>
            </div>

            {/* Right Column: Featured Card */}
            <div className="featured-product-card" id="featured-product-display">
              <div className="featured-card-image-box">
                <img src={activeCol.img} alt={activeCol.title} id="featured-card-image" />
              </div>
              <div className="featured-card-content">
                <div className="featured-card-header">
                  <div>
                    <span className="featured-card-tag" id="featured-card-grade">{activeCol.grade}</span>
                    <h3 id="featured-card-title">{activeCol.title}</h3>
                  </div>
                  <span className="featured-card-price" id="featured-card-price">${activeCol.price}</span>
                </div>
                <p className="featured-card-desc" id="featured-card-desc">
                  {activeCol.desc}
                </p>
                <div className="featured-card-actions">
                  <div className="quantity-selector">
                    <button 
                      className="qty-btn"
                      onClick={() => setFeaturedQty(q => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      className="qty-input" 
                      value={featuredQty} 
                      readOnly 
                    />
                    <button 
                      className="qty-btn"
                      onClick={() => setFeaturedQty(q => q + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="btn btn-lime add-to-cart-action"
                    onClick={() => addToCart(activeCol.id, activeCol.title, activeCol.price, activeCol.img, featuredQty)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Below Grid: Accessories */}
          <div className="accessories-grid reveal-on-scroll">
            <div className="accessory-card">
              <div className="accessory-image-box">
                <img src="/assets/matcha_starter_kit.png" alt="Bamboo Whisk" className="clip-whisk" />
              </div>
              <div className="accessory-info">
                <h4>Traditional Chasen</h4>
                <p>100-prong golden bamboo whisk.</p>
                <div className="accessory-price-row">
                  <span>$15</span>
                  <button 
                    className="circle-add-btn"
                    onClick={() => addToCart('bamboo-whisk', 'Traditional Chasen Whisk', 15.00, '/assets/matcha_starter_kit.png')}
                  >
                    <i className="fa-solid fa-plus" />
                  </button>
                </div>
              </div>
            </div>

            <div className="accessory-card">
              <div className="accessory-image-box">
                <img src="/Matcha Latte JPG images/ezgif-frame-001.jpg" alt="Ceramic Mug" className="clip-mug" />
              </div>
              <div className="accessory-info">
                <h4>Chawan Ceramic Mug</h4>
                <p>Hand-fired rustic clay matcha bowl.</p>
                <div className="accessory-price-row">
                  <span>$22</span>
                  <button 
                    className="circle-add-btn"
                    onClick={() => addToCart('ceramic-chawan', 'Chawan Ceramic Mug', 22.00, '/Matcha Latte JPG images/ezgif-frame-001.jpg')}
                  >
                    <i className="fa-solid fa-plus" />
                  </button>
                </div>
              </div>
            </div>

            <div className="accessory-card">
              <div className="accessory-image-box">
                <img src="/Matcha Latte JPG images/ezgif-frame-001.jpg" alt="Kyusu Teapot" className="clip-teapot" />
              </div>
              <div className="accessory-info">
                <h4>Kyusu Tea Pot</h4>
                <p>Artisan ceramic side-handled teapot.</p>
                <div className="accessory-price-row">
                  <span>$38</span>
                  <button 
                    className="circle-add-btn"
                    onClick={() => addToCart('kyusu-teapot', 'Kyusu Tea Pot', 38.00, '/Matcha Latte JPG images/ezgif-frame-001.jpg')}
                  >
                    <i className="fa-solid fa-plus" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="collection-footer-cta">
            <a href="#products" className="btn btn-pill-lime">Explore All Products</a>
          </div>

        </div>
      </section>

      {/* ==================== 6) ESSENTIALS SECTION ==================== */}
      <section className="essentials-section" id="essentials">
        <div className="section-container">
          
          <div className="essentials-header reveal-on-scroll">
            <span className="section-subtitle text-center">Ritual Pairings</span>
            <h2 className="section-title-serif text-center">Matcha Pairing Essentials</h2>
            <p className="section-description-sans text-center">Expand your kitchen pantry with premium matcha variants designed for everyday cooking, baking, and smooth lattes.</p>
          </div>

          <div className="essentials-grid reveal-on-scroll">
            
            {/* Card 1: Latte Mix */}
            <div className="essential-card">
              <div className="essential-image-box">
                <img src="/Matcha Latte JPG images/ezgif-frame-100.jpg" alt="Matcha Latte Mix glass" />
                <span className="essential-price-badge">$19</span>
              </div>
              <div className="essential-content">
                <h3>Matcha Latte Mix</h3>
                <p>Pre-blended organic matcha with organic coconut sugar. Creamy, subtly sweet, and whisks instantly into milk or oat water.</p>
                <button 
                  className="btn btn-dark-outline"
                  onClick={() => addToCart('matcha-latte-mix', 'Matcha Latte Mix', 19.00, '/Matcha Latte JPG images/ezgif-frame-100.jpg')}
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Card 2: Cake Powder */}
            <div className="essential-card">
              <div className="essential-image-box">
                <img src="/assets/matcha_cake_powder.png" alt="Matcha cake culinary powder" />
                <span className="essential-price-badge">$15</span>
              </div>
              <div className="essential-content">
                <h3>Matcha Cake Powder</h3>
                <p>High-antioxidant culinary grade powder with deep roasted tea notes, custom blended for desserts, crepes, and pastries.</p>
                <button 
                  className="btn btn-dark-outline"
                  onClick={() => addToCart('matcha-cake-powder', 'Matcha Cake Powder', 15.00, '/assets/matcha_cake_powder.png')}
                >
                  Add to Cart
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== 7) FOOTER / CLOSING CTA ==================== */}
      <footer className="main-footer" id="footer">
        <div className="footer-background-gradient" />
        <div className="footer-container">
          
          <div className="footer-grid-split">
            
            {/* Left Content */}
            <div className="footer-left-content">
              <span className="hero-label">Exclusive Offer</span>
              <h2 className="footer-offer-title">Save up to 50% or more on matcha powder</h2>
              <p className="footer-offer-desc">
                Join our monthly subscription plan. Get fresh stone-ground tea canisters delivered directly from Uji to your doorstep. Cancel anytime.
              </p>
              
              <div className="footer-newsletter-row">
                <input type="email" placeholder="Your email address" className="footer-input" />
                <button className="btn btn-lime-square">Subscribe Now</button>
              </div>

              <div className="footer-contact-details">
                <div className="contact-item">
                  <span className="contact-label">Call Us</span>
                  <a href="tel:+810752468110" className="contact-value">+81 (075) 246-8110</a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Write Us</span>
                  <a href="mailto:ritual@matonmatcha.com" className="contact-value">ritual@matonmatcha.com</a>
                </div>
              </div>

              <div className="footer-links-grid">
                <div className="links-column">
                  <h4>Shop</h4>
                  <ul>
                    <li><a href="#products">Ceremonial Grade</a></li>
                    <li><a href="#products">Culinary Blends</a></li>
                    <li><a href="#starter-kit">Starter Bundles</a></li>
                    <li><a href="#essentials">Matcha Teaware</a></li>
                  </ul>
                </div>

                <div className="links-column">
                  <h4>Ritual</h4>
                  <ul>
                    <li><a href="#benefits">Health Benefits</a></li>
                    <li><a href="#">Preparation Guide</a></li>
                    <li><a href="#">Sourcing Story</a></li>
                    <li><a href="#">Sustainability</a></li>
                  </ul>
                </div>

                <div className="links-column">
                  <h4>Legal</h4>
                  <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Refund Policy</a></li>
                    <li><a href="#">Shipping FAQ</a></li>
                  </ul>
                </div>
              </div>

              <div className="footer-bottom-bar">
                <span className="copyright-text">&copy; 2026 MATON Matcha Co. All Rights Reserved.</span>
                <div className="footer-socials">
                  <a href="#"><i className="fa-brands fa-instagram" /></a>
                  <a href="#"><i className="fa-brands fa-pinterest" /></a>
                  <a href="#"><i className="fa-brands fa-youtube" /></a>
                </div>
              </div>
            </div>

            {/* Right Side: Static representation of pouring mix */}
            <div className="footer-right-animation-box" id="canvas-trigger-section">
              <div className="canvas-sticky-wrapper">
                <div className="canvas-caption-box">
                  <span className="canvas-tag">Liquid Art</span>
                  <h3>The Perfect Pour</h3>
                  <p>Watch milk blend into premium stone-ground matcha. A dance of natural flavor.</p>
                </div>
                
                <div className="canvas-element-container">
                  <img 
                    src="/Matcha Latte JPG images/ezgif-frame-100.jpg" 
                    alt="Matcha Latte poured view" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
};

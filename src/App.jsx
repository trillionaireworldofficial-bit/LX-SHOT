import { useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { products } from './data/products';
import { addToCart, calculateTotals, formatCurrency, removeFromCart, updateQuantity } from './utils/cart';
import { resolveAssetPath } from './utils/assetPaths';

const categoryOptions = ['All', 'Whole Bean', 'Ground Coffee', 'Instant Coffee', 'Coffee Pods', 'Coffee Sticks', 'Espresso Collection', 'Cold Brew', 'Reserve Collection', 'Gift Collection', 'Specialty Blend'];
const collectionCards = [
  { title: 'Signature Editions', description: 'Small-batch Arabica selected for clarity, balance, and calm precision.', badge: 'Limited release' },
  { title: 'Reserve Series', description: 'Elevated single-origin expressions for slower rituals and gift-worthy presentation.', badge: 'Reserve' },
  { title: 'Travel Ritual', description: 'Luxury coffee sticks and instant formats for polished on-the-go rituals.', badge: 'Travel' },
  { title: 'Gift Presentation', description: 'Curated sets and gift boxes designed for thoughtful giving.', badge: 'Gift' }
];

function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const cartItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totals = useMemo(() => calculateTotals(cart), [cart]);

  const handleAddToCart = (product, quantity = 1) => {
    setCart((current) => addToCart(current, product, quantity));
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCart((current) => updateQuantity(current, productId, delta));
  };

  const handleRemoveItem = (productId) => {
    setCart((current) => removeFromCart(current, productId));
  };

  const featuredProducts = useMemo(() => products.filter((item) => item.featured).slice(0, 6), []);
  const familyProducts = useMemo(() => products.filter((item) => item.collection !== 'Gift').slice(0, 6), []);
  const visibleProducts = selectedCategory === 'All' ? products : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand-mark" aria-label="LX SHOT home">
          <img src={resolveAssetPath('/logo.png')} alt="LX SHOT logo" />
          <span>LX SHOT</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/story">Our Story</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/cart" className="cart-link">Cart ({cartItems})</NavLink>
        </nav>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomeSection featuredProducts={featuredProducts} familyProducts={familyProducts} collections={collectionCards} onAdd={handleAddToCart} />} />
          <Route path="/shop" element={<ShopPage products={visibleProducts} onAdd={handleAddToCart} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} categoryOptions={categoryOptions} />} />
          <Route path="/collections" element={<CollectionsPage collections={collectionCards} />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage products={products} onAdd={handleAddToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} onUpdate={handleUpdateQuantity} onRemove={handleRemoveItem} totals={totals} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} totals={totals} onBack={() => navigate('/cart')} />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div>
          <img src={resolveAssetPath('/logo.png')} alt="LX SHOT logo" className="footer-logo" />
          <p>Intentional Energy.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/shop">Shop</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/story">Our Story</Link>
        </div>
        <div>
          <h3>Support</h3>
          <a href="mailto:contact@lxshot.com">contact@lxshot.com</a>
          <a href="mailto:order@lxshot.com">order@lxshot.com</a>
          <Link to="/checkout">Checkout</Link>
        </div>
      </footer>
    </div>
  );
}

function HomeSection({ featuredProducts, familyProducts, collections, onAdd }) {
  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Ultra-premium specialty coffee</p>
          <h1>Arabica crafted for clarity, balance, and quiet luxury.</h1>
          <p className="hero-text">LX SHOT brings intentional, traceable coffee to the everyday ritual with calm confidence and an unmistakably refined presence.</p>
          <div className="hero-actions">
            <Link to="/shop" className="button primary">Shop the collection</Link>
            <Link to="/story" className="button secondary">Read our story</Link>
          </div>
        </div>
        <div className="hero-visual">
          <img src={resolveAssetPath('/hero-visual.webp')} alt="Premium LX SHOT coffee packaging composition" />
        </div>
      </section>

      <section className="section-grid intro-strip">
        <article>
          <h2>Single-origin precision</h2>
          <p>Each offering is selected with intention, roasted with restraint, and balanced for smooth, focused mornings.</p>
        </article>
        <article>
          <h2>Refined ritual</h2>
          <p>From whole bean to instant and pods, LX SHOT translates origin into a premium, everyday experience.</p>
        </article>
        <article>
          <h2>Quiet luxury</h2>
          <p>Minimal packaging, considered composition, and a calm presence that feels elevated without excess.</p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Featured collection</p>
          <h2>Signature coffees, edited with care.</h2>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Premium family showcase</p>
          <h2>Whole bean, ground, instant, pods, sticks, and reserve formats.</h2>
        </div>
        <div className="family-showcase">
          {familyProducts.map((product) => (
            <article className="family-card" key={product.id}>
              <PackagingVisual product={product} compact />
              <div>
                <p className="collection-badge">{product.category}</p>
                <h3>{product.name}</h3>
                <p>{product.origin}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block split-layout">
        <div>
          <p className="eyebrow">Origin story</p>
          <h2>Crafted with high-altitude Arabica and precise roasting.</h2>
          <p>Every cup begins with a thoughtful selection of high-altitude Arabica and a medium roast chosen to preserve clarity and smoothness.</p>
          <Link to="/story" className="text-link">Discover our philosophy</Link>
        </div>
        <div className="panel-card">
          <h3>From source to cup</h3>
          <ul>
            <li>Careful selection</li>
            <li>Medium roast profile</li>
            <li>Balanced tasting notes</li>
            <li>Everyday ritual</li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Collections</p>
          <h2>Explore the LX SHOT experience.</h2>
        </div>
        <div className="collection-grid">
          {collections.map((item) => (
            <article className="collection-card" key={item.title}>
              <p className="collection-badge">{item.badge}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link to="/collections" className="text-link">View collection</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ShopPage({ products, onAdd, selectedCategory, onSelectCategory, categoryOptions }) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Shop</p>
        <h1>The LX SHOT collection.</h1>
        <p>Whole bean, ground, instant, pods, sticks, reserve, and gift formats curated for a refined everyday ritual.</p>
      </div>
      <div className="filter-row" role="tablist" aria-label="Product categories">
        {categoryOptions.map((category) => (
          <button key={category} type="button" className={`filter-pill ${selectedCategory === category ? 'active' : ''}`} onClick={() => onSelectCategory(category)}>
            {category}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

function CollectionsPage({ collections }) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Collections</p>
        <h1>Curated formats for every ritual.</h1>
      </div>
      <div className="collection-grid">
        {collections.map((item) => (
          <article className="collection-card featured" key={item.title}>
            <p className="collection-badge">{item.badge}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      <div className="section-grid intro-strip">
        <article>
          <h2>Reserve</h2>
          <p>Elevated coffee for slower mornings and considered gifting.</p>
        </article>
        <article>
          <h2>Everyday</h2>
          <p>Forms designed for convenience without sacrificing craftsmanship.</p>
        </article>
        <article>
          <h2>Travel</h2>
          <p>Luxury coffee sticks and instant formats for refined on-the-go rituals.</p>
        </article>
      </div>
    </section>
  );
}

function StoryPage() {
  return (
    <section className="section-block story-page">
      <div className="section-heading">
        <p className="eyebrow">Our story</p>
        <h1>Clarity, origin, and precision.</h1>
      </div>
      <div className="story-layout">
        <div>
          <p>LX SHOT exists for people who want coffee to feel considered rather than noisy. We work with high-altitude Arabica, shape flavor through precise medium roasting, and create a ritual that feels calm and clear.</p>
          <p>Our approach is simple: quality over quantity, focus over stimulation, and consistency over shortcuts. The result is a premium coffee experience that feels quietly confident.</p>
        </div>
        <div className="panel-card">
          <h3>The LX SHOT way</h3>
          <ul>
            <li>High-altitude Arabica</li>
            <li>Carefully selected beans</li>
            <li>Medium roast for balance</li>
            <li>Intentional ritual</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="section-block contact-page">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>Questions about the collection?</h1>
      </div>
      <div className="story-layout">
        <div className="panel-card">
          <h3>Write to us</h3>
          <p><a href="mailto:contact@lxshot.com">contact@lxshot.com</a></p>
          <p><a href="mailto:order@lxshot.com">order@lxshot.com</a></p>
        </div>
        <div className="panel-card">
          <h3>Visit</h3>
          <p>Mon–Fri · 9am–6pm</p>
          <p>Luxury coffee consultations available by request.</p>
        </div>
      </div>
    </section>
  );
}

function ProductDetailPage({ products, onAdd }) {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <section className="section-block"><h1>Product unavailable</h1></section>;
  }

  const relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <section className="product-detail">
      <div className="product-detail-visual">
        <PackagingVisual product={product} />
      </div>
      <div className="product-detail-info">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="meta-list">
          <span>Origin: {product.origin}</span>
          <span>Roast: {product.roast}</span>
          <span>Weight: {product.weight}</span>
        </div>
        <div className="note-list">
          {product.tastingNotes.map((note) => <span key={note}>{note}</span>)}
        </div>
        <div className="price-row">
          <h2>{formatCurrency(product.price)}</h2>
          <div className="quantity-controls">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => value + 1)}>+</button>
          </div>
        </div>
        <div className="hero-actions">
          <button type="button" className="button primary" onClick={() => onAdd(product, quantity)}>Add to cart</button>
          <Link to="/checkout" className="button secondary">Go to checkout</Link>
        </div>
        <div className="panel-card detail-panel">
          <h3>Shipping and care</h3>
          <p>Complimentary shipping over $120. Packages arrive in premium presentation boxes with careful insulation.</p>
        </div>
        <div className="related-block">
          <h3>Related products</h3>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <Link key={item.id} to={`/product/${item.slug}`} className="related-card">
                <PackagingVisual product={item} compact />
                <p>{item.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CartPage({ cart, onUpdate, onRemove, totals }) {
  return (
    <section className="section-block cart-page">
      <div className="section-heading">
        <p className="eyebrow">Cart</p>
        <h1>Your refined order.</h1>
      </div>
      {cart.length === 0 ? (
        <div className="panel-card empty-state">
          <h3>Your cart is ready for a premium ritual.</h3>
          <Link to="/shop" className="button primary">Browse the collection</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-thumb">
                  <PackagingVisual product={item.product} compact />
                </div>
                <div className="cart-meta">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.origin}</p>
                  <div className="quantity-controls">
                    <button type="button" onClick={() => onUpdate(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onUpdate(item.id, 1)}>+</button>
                  </div>
                </div>
                <div className="cart-price">
                  <p>{formatCurrency(item.product.price * item.quantity)}</p>
                  <button type="button" className="text-link" onClick={() => onRemove(item.id)}>Remove</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="panel-card summary-card">
            <h3>Order summary</h3>
            <div className="summary-line"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
            <div className="summary-line"><span>Shipping</span><span>{formatCurrency(totals.shipping)}</span></div>
            <div className="summary-line total"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
            <Link to="/checkout" className="button primary">Continue to checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}

function CheckoutPage({ cart, totals, onBack }) {
  return (
    <section className="section-block checkout-page">
      <div className="section-heading">
        <p className="eyebrow">Checkout</p>
        <h1>Secure, calm, and elegant.</h1>
      </div>
      <div className="cart-layout">
        <form className="panel-card form-card">
          <label>
            Email
            <input type="email" placeholder="name@domain.com" />
          </label>
          <label>
            Shipping address
            <input type="text" placeholder="Street address" />
          </label>
          <label>
            City
            <input type="text" placeholder="City" />
          </label>
          <label>
            Postal code
            <input type="text" placeholder="00000" />
          </label>
          <div className="payment-options">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
            <span>Google Pay</span>
            <span>PayPal</span>
          </div>
          <button type="button" className="button primary">Place order</button>
        </form>
        <aside className="panel-card summary-card">
          <h3>Order summary</h3>
          {cart.map((item) => (
            <div className="summary-line" key={item.id}>
              <span>{item.product.name} × {item.quantity}</span>
              <span>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-line"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          <div className="summary-line"><span>Shipping</span><span>{formatCurrency(totals.shipping)}</span></div>
          <div className="summary-line total"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
          <button type="button" className="button secondary" onClick={onBack}>Back to cart</button>
        </aside>
      </div>
    </section>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-link">
        <PackagingVisual product={product} />
        <div className="product-card-copy">
          <div className="product-meta-row">
            <span>{product.category}</span>
            <span>{product.origin}</span>
          </div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div className="product-meta-row small">
            <span>{product.weight}</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
        </div>
      </Link>
      <div className="card-actions">
        <button type="button" className="button primary" onClick={() => onAdd(product, 1)}>Add to cart</button>
      </div>
    </article>
  );
}

function PackagingVisual({ product, compact = false }) {
  return (
    <div className={`package-visual ${compact ? 'compact' : ''}`}>
      <img src={resolveAssetPath(product.image)} alt={product.imageAlt} className="package-image" />
    </div>
  );
}

export default App;

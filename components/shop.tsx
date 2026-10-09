'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Photo } from './photo';
import { ShopOverlay } from './shop-overlay';
import { SmoothScroll } from './smooth-scroll';
import { formatPrice, instagram, products, type Product } from '@/lib/products';

type BagItem = { id: string; size: string; quantity: number };
type Panel = 'menu' | 'search' | 'bag' | 'product' | 'help' | 'finder' | 'checkout' | 'confirmation' | null;
type FinderMood = 'sweet' | 'dark' | 'lowkey' | 'graphic';
type FinderPlan = 'everyday' | 'matching' | 'statement';
type CheckoutStep = 'details' | 'payment';
type CheckoutForm = { name: string; phone: string; city: string; address: string; notes: string };
type LastOrder = { items: BagItem[]; total: number; method: string; reference: string } | null;

type ShopContextValue = {
  view: (product: Product) => void;
  finder: () => void;
  match: () => void;
  help: (topic: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);
function useShop() {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error('ShopProvider required');
  return shop;
}

const navigation = [
  ['SHOP', '#shop'],
  ['TROUSERS', '#trousers'],
  ['MATCHING', '#matching'],
  ['TOPS', '#tops'],
] as const;

const helpText: Record<string, { title: string; body: string; note?: string }> = {
  sizing: {
    title: 'size help.',
    body: 'Every product shows its intended fit and a size note before you add it to your bag. For launch, swap the sample guide below with SHAWTYSLAYZ’s exact garment measurements.',
    note: 'Sample waist guide: XS 26–28 · S 28–30 · M 30–32 · L 32–34 · XL 34–36 in.',
  },
  shipping: {
    title: 'shipping.',
    body: 'Delivery is available across Pakistan. The checkout preview shows a standard delivery option so customers always see shipping before they place an order.',
    note: 'Final courier timing and charges should be connected to the brand’s live delivery policy before launch.',
  },
  returns: {
    title: 'exchanges & returns.',
    body: 'Customers should see the real exchange and return terms before checkout, not discover them in DMs afterward.',
    note: 'Connect SHAWTYSLAYZ’s final eligibility window, condition requirements, and courier process here before launch.',
  },
  orders: {
    title: 'how ordering works.',
    body: 'Choose a piece, pick a size, add it to your bag, enter delivery details, choose payment, and receive an order confirmation. This prototype demonstrates that full path without processing a real transaction.',
  },
  contact: {
    title: 'let’s talk.',
    body: 'Questions about sizing, customization, or a drop can still go straight to SHAWTYSLAYZ on Instagram.',
  },
  privacy: {
    title: 'privacy.',
    body: 'A live store should explain what customer information is collected, why it is needed, how long it is retained, and which payment or delivery partners receive it.',
    note: 'This concept does not send or store checkout form data on a server.',
  },
  terms: {
    title: 'store terms.',
    body: 'Before launch, add the brand’s final payment, order cancellation, customization, delivery, exchange, and refund terms in one clear place.',
  },
};

const finderMoods: { id: FinderMood; label: string; detail: string }[] = [
  { id: 'sweet', label: 'cute, not quiet', detail: 'white / pink · playful print' },
  { id: 'dark', label: 'dark with a point', detail: 'black / yellow · louder mood' },
  { id: 'lowkey', label: 'off-duty', detail: 'checks · easy everyday pair' },
  { id: 'graphic', label: 'one bold thing', detail: 'graphic tee · simple base' },
];

const finderPlans: { id: FinderPlan; label: string; detail: string }[] = [
  { id: 'everyday', label: 'wear it on repeat', detail: 'easy rotation piece' },
  { id: 'matching', label: 'match somebody', detail: 'same energy, different pair' },
  { id: 'statement', label: 'make the fit', detail: 'let one piece lead' },
];

function getFinderResult(mood: FinderMood, plan: FinderPlan) {
  if (plan === 'matching') return products.find(product => product.id === (mood === 'dark' ? 'bat' : 'kitty')) ?? products[0];
  if (mood === 'graphic') return products.find(product => product.id === 'tee') ?? products[0];
  if (mood === 'lowkey') return products.find(product => product.id === 'plaid') ?? products[0];
  return products.find(product => product.mood === mood) ?? products[0];
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [selected, setSelected] = useState<Product>(products[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<'product' | 'detail'>('product');
  const [bag, setBag] = useState<BagItem[]>([]);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('sizing');
  const [notice, setNotice] = useState('');
  const [overlayMounted, setOverlayMounted] = useState(false);
  const [finderMood, setFinderMood] = useState<FinderMood | null>(null);
  const [finderPlan, setFinderPlan] = useState<FinderPlan | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('details');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({ name: '', phone: '', city: '', address: '', notes: '' });
  const [lastOrder, setLastOrder] = useState<LastOrder>(null);
  const pendingAnchor = useRef<string | null>(null);

  useEffect(() => {
    if (overlayMounted || !pendingAnchor.current) return;
    const hash = pendingAnchor.current;
    pendingAnchor.current = null;
    const frame = requestAnimationFrame(() => window.dispatchEvent(new CustomEvent('shop:navigate', { detail: hash })));
    return () => cancelAnimationFrame(frame);
  }, [overlayMounted]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const count = bag.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = bag.reduce((sum, item) => {
    const product = products.find(candidate => candidate.id === item.id);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + (bag.length ? shipping : 0);

  const openPanel = (next: Panel) => {
    setOverlayMounted(true);
    setPanel(next);
  };

  const close = () => setPanel(null);

  const view = (product: Product) => {
    setSelected(product);
    setSelectedSize('');
    setSelectedPhoto('product');
    setNotice('');
    openPanel('product');
  };

  const openFinder = () => {
    setFinderMood(null);
    setFinderPlan(null);
    openPanel('finder');
  };

  const add = (product: Product, size: string, quantity = 1) => {
    if (!size) return;
    setBag(current => {
      const next = current.map(item => ({ ...item }));
      const item = next.find(candidate => candidate.id === product.id && candidate.size === size);
      if (item) item.quantity += quantity;
      else next.push({ id: product.id, size, quantity });
      return next;
    });
    setNotice(`${product.name} · ${size} added to bag`);
  };

  const removeFromBag = (id: string, size: string) => setBag(current => current.filter(item => !(item.id === id && item.size === size)));
  const changeQuantity = (id: string, size: string, amount: number) => {
    const existing = bag.find(item => item.id === id && item.size === size);
    if (!existing) return;
    if (existing.quantity + amount <= 0) {
      removeFromBag(id, size);
      return;
    }
    setBag(current => current.map(item => item.id === id && item.size === size ? { ...item, quantity: item.quantity + amount } : item));
  };

  const navigateAfterClose = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    pendingAnchor.current = href;
    close();
  };

  const startCheckout = () => {
    if (!bag.length) return;
    setCheckoutStep('details');
    openPanel('checkout');
  };

  const submitDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutStep('payment');
  };

  const placeDemoOrder = () => {
    const reference = 'SS-DEMO-001';
    setLastOrder({ items: bag.map(item => ({ ...item })), total, method: paymentMethod, reference });
    setBag([]);
    openPanel('confirmation');
  };

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? products.filter(product => [product.name, product.color, product.category, product.mood].some(value => value.toLowerCase().includes(normalizedQuery)))
    : products;

  const finderResult = useMemo(
    () => finderMood && finderPlan ? getFinderResult(finderMood, finderPlan) : null,
    [finderMood, finderPlan],
  );

  return (
    <ShopContext.Provider value={{
      view,
      finder: openFinder,
      match: openFinder,
      help: name => { setTopic(name); openPanel('help'); },
    }}>
      <SmoothScroll locked={overlayMounted} />
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <div className="container header-inner">
          <button className="mobile-toggle icon-button" aria-label="Open navigation" aria-expanded={panel === 'menu'} onClick={() => openPanel('menu')}>
            <Menu size={22} />
          </button>
          <a className="brand-lockup" href="#home" aria-label="SHAWTYSLAYZ home"><span className="wordmark">SHAWTYSLAYZ</span></a>
          <nav aria-label="Main navigation">
            {navigation.map(([name, href]) => <a key={name} href={href}>{name}</a>)}
          </nav>
          <div className="header-actions">
            <a className="header-instagram" href={instagram} target="_blank" rel="noreferrer">INSTAGRAM</a>
            <button className="search-toggle" aria-label="Search pieces" onClick={() => openPanel('search')}><Search size={20} /></button>
            <button aria-label={`Open bag, ${count} items`} onClick={() => openPanel('bag')}>
              <ShoppingBag size={20} /><span aria-live="polite">{count}</span>
            </button>
          </div>
        </div>
      </header>

      {children}

      <AnimatePresence onExitComplete={() => setOverlayMounted(false)}>
        {panel && (
          <ShopOverlay key="shop-overlay" kind={panel} close={close}>
            {panel === 'menu' && (
              <>
                <h2 id="dialog-title" tabIndex={-1} className="sr-only">Navigation</h2>
                <nav className="mobile-links" aria-label="Mobile navigation">
                  {navigation.map(([name, href]) => <a key={name} href={href} onClick={event => navigateAfterClose(event, href)}>{name}</a>)}
                  <button onClick={openFinder}>FIND YOUR PAIR</button>
                  <a href={instagram} target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
                </nav>
                <button className="menu-search text-link" onClick={() => openPanel('search')}><Search size={18} /> Search pieces</button>
                <p className="menu-note">Size help · checkout preview · delivery across Pakistan.</p>
              </>
            )}

            {panel === 'search' && (
              <>
                <h2 id="dialog-title" tabIndex={-1}>find your fit.</h2>
                <label className="search-field">
                  <Search size={20} />
                  <input aria-label="Search products" placeholder="try kitty, bat, black or trousers…" value={query} onChange={event => setQuery(event.target.value)} />
                </label>
                <p className="fineprint" aria-live="polite">{results.length} {results.length === 1 ? 'piece' : 'pieces'} to explore</p>
                <div className="search-results">
                  {results.map(product => (
                    <button key={product.id} onClick={() => view(product)}>
                      <Photo name={product.image} alt={product.alt} sizes="80px" />
                      <span>{product.name}<small>{product.color} · {formatPrice(product.price)}</small></span>
                      <ArrowUpRight size={20} />
                    </button>
                  ))}
                </div>
                {results.length === 0 && <p className="empty-state compact-empty">no match yet.<br />try a colour, category, or print.</p>}
              </>
            )}

            {panel === 'product' && (
              <div className="quick-shop">
                <div className="quick-shop-gallery">
                  <Photo
                    name={selectedPhoto === 'product' ? selected.image : selected.detail}
                    alt={selectedPhoto === 'product' ? selected.alt : `${selected.name} styled detail`}
                    className="quick-shop-main"
                    sizes="(max-width: 767px) 100vw, 560px"
                  />
                  <div className="quick-shop-thumbs" aria-label="Product images">
                    <button className={selectedPhoto === 'product' ? 'active' : ''} onClick={() => setSelectedPhoto('product')} aria-label="Show product image">
                      <Photo name={selected.image} alt="" sizes="84px" />
                    </button>
                    <button className={selectedPhoto === 'detail' ? 'active' : ''} onClick={() => setSelectedPhoto('detail')} aria-label="Show styled image">
                      <Photo name={selected.detail} alt="" sizes="84px" />
                    </button>
                  </div>
                </div>

                <div className="quick-shop-copy">
                  <p className="eyebrow">{selected.color.toUpperCase()}</p>
                  <div className="product-title-row">
                    <h2 id="dialog-title" tabIndex={-1}>{selected.name}</h2>
                    <strong>{formatPrice(selected.price)}</strong>
                  </div>
                  <p className="product-description">{selected.description}</p>
                  <div className="product-facts" aria-label="Product details">
                    <span><b>FIT</b>{selected.fit}</span>
                    <span><b>FABRIC</b>{selected.fabric}</span>
                    <span><b>CARE</b>{selected.care}</span>
                  </div>

                  <fieldset className="size-picker">
                    <legend><span>PICK YOUR SIZE</span><button type="button" onClick={() => { setTopic('sizing'); openPanel('help'); }}>SIZE HELP</button></legend>
                    <div>{selected.sizes.map(size => <button key={size} type="button" className={selectedSize === size ? 'selected' : ''} aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div>
                  </fieldset>
                  <p className="size-note">{selected.sizeNote}</p>

                  <button className="button full-button add-bag-button" disabled={!selectedSize} onClick={() => add(selected, selectedSize)}>
                    {selectedSize ? <>ADD TO BAG <span>{formatPrice(selected.price)}</span></> : <>PICK A SIZE <ArrowRight size={18} /></>}
                  </button>
                  <div className="quick-shop-status" aria-live="polite">
                    <span>{notice}</span>
                    {notice && <button onClick={() => openPanel('bag')}>VIEW BAG <ChevronRight size={16} /></button>}
                  </div>
                  <div className="purchase-reassurance">
                    <button onClick={() => { setTopic('shipping'); openPanel('help'); }}>Delivery across Pakistan</button>
                    <button onClick={() => { setTopic('returns'); openPanel('help'); }}>Exchange info</button>
                    <span>Customization available</span>
                  </div>
                </div>
              </div>
            )}

            {panel === 'bag' && (
              <>
                <div className="bag-heading-row">
                  <h2 id="dialog-title" tabIndex={-1}>your bag.<span className="bag-number">({count})</span></h2>
                  {bag.length > 0 && <span className="bag-saved">size stays with each item</span>}
                </div>
                {bag.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingBag size={34} strokeWidth={1.2} />
                    <div><p>nothing in here yet.</p><span className="fineprint">Find the pair that actually feels like you.</span></div>
                    <button className="button" onClick={openFinder}>FIND YOUR PAIR <ArrowUpRight size={18} /></button>
                    <a className="text-link" href="#shop" onClick={event => navigateAfterClose(event, '#shop')}>SHOP THE DROP <ArrowRight size={17} /></a>
                  </div>
                ) : (
                  <>
                    <ul className="bag-list">
                      {bag.map(item => {
                        const product = products.find(candidate => candidate.id === item.id)!;
                        return (
                          <li key={`${item.id}-${item.size}`}>
                            <button className="bag-product-image" onClick={() => view(product)} aria-label={`View ${product.name}`}><Photo name={product.image} alt={product.alt} sizes="100px" /></button>
                            <div className="bag-item-copy">
                              <button className="bag-product-name" onClick={() => view(product)}>{product.name}</button>
                              <p className="fineprint">{product.color} · Size {item.size}</p>
                              <strong>{formatPrice(product.price * item.quantity)}</strong>
                              <div className="quantity" aria-label={`Quantity for ${product.name}, size ${item.size}`}>
                                <button aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(item.id, item.size, -1)}><Minus size={15} /></button>
                                <span>{item.quantity}</span>
                                <button aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(item.id, item.size, 1)}><Plus size={15} /></button>
                              </div>
                            </div>
                            <button className="remove-item" aria-label={`Remove ${product.name}, size ${item.size}, from bag`} onClick={() => removeFromBag(item.id, item.size)}><X size={18} /></button>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="bag-summary">
                      <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                      <div><span>Delivery</span><strong>{shipping === 0 ? 'Free' : `${formatPrice(shipping)}*`}</strong></div>
                      <div className="bag-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
                    </div>
                    <p className="checkout-note">*Sample delivery fee for this prototype. Connect the brand’s live courier pricing before launch.</p>
                    <button className="button full-button checkout-button" onClick={startCheckout}>CHECKOUT <ArrowRight size={18} /></button>
                    <div className="bag-help-row"><button onClick={() => { setTopic('orders'); openPanel('help'); }}>How ordering works</button><button onClick={() => { setTopic('shipping'); openPanel('help'); }}>Shipping</button></div>
                  </>
                )}
              </>
            )}

            {panel === 'finder' && (
              <div className="finder">
                <h2 id="dialog-title" tabIndex={-1}>find your pair.</h2>
                <p className="finder-intro">Two taps. No twenty-question personality test.</p>
                {!finderMood && (
                  <div className="finder-step">
                    <span className="finder-count">01 / 02</span>
                    <h3>what mood are we on?</h3>
                    <div className="finder-options">
                      {finderMoods.map(option => <button key={option.id} onClick={() => setFinderMood(option.id)}><span>{option.label}</span><small>{option.detail}</small><ArrowRight size={18} /></button>)}
                    </div>
                  </div>
                )}
                {finderMood && !finderPlan && (
                  <div className="finder-step">
                    <button className="finder-back" onClick={() => setFinderMood(null)}><ArrowLeft size={16} /> BACK</button>
                    <span className="finder-count">02 / 02</span>
                    <h3>what’s the plan?</h3>
                    <div className="finder-options">
                      {finderPlans.map(option => <button key={option.id} onClick={() => setFinderPlan(option.id)}><span>{option.label}</span><small>{option.detail}</small><ArrowRight size={18} /></button>)}
                    </div>
                  </div>
                )}
                {finderResult && finderMood && finderPlan && (
                  <div className="finder-result">
                    <Photo name={finderResult.image} alt={finderResult.alt} sizes="(max-width: 767px) 100vw, 420px" />
                    <div>
                      <span className="finder-count">YOUR MATCH</span>
                      <h3>{finderResult.name}</h3>
                      <p>You picked <b>{finderMoods.find(item => item.id === finderMood)?.label}</b> + <b>{finderPlans.find(item => item.id === finderPlan)?.label}</b>. This is the cleanest place to start.</p>
                      <strong>{formatPrice(finderResult.price)}</strong>
                      <button className="button full-button" onClick={() => view(finderResult)}>QUICK SHOP <ArrowUpRight size={18} /></button>
                      <button className="finder-restart" onClick={() => { setFinderMood(null); setFinderPlan(null); }}>START AGAIN</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {panel === 'checkout' && (
              <div className="checkout">
                <div className="checkout-topline">
                  <h2 id="dialog-title" tabIndex={-1}>checkout.</h2>
                  <span>DEMO · NO PAYMENT PROCESSED</span>
                </div>
                <div className="checkout-progress" aria-label="Checkout progress">
                  <span className="done"><Check size={14} /> BAG</span>
                  <span className={checkoutStep === 'details' ? 'current' : 'done'}>{checkoutStep === 'payment' ? <Check size={14} /> : '2'} DETAILS</span>
                  <span className={checkoutStep === 'payment' ? 'current' : ''}>3 PAYMENT</span>
                </div>

                {checkoutStep === 'details' ? (
                  <form className="checkout-form" onSubmit={submitDetails}>
                    <div className="checkout-section-heading"><h3>delivery details</h3><p>Where should the order go?</p></div>
                    <label>Full name<input required autoComplete="name" value={checkoutForm.name} onChange={event => setCheckoutForm({ ...checkoutForm, name: event.target.value })} placeholder="Your name" /></label>
                    <label>Phone number<input required autoComplete="tel" inputMode="tel" value={checkoutForm.phone} onChange={event => setCheckoutForm({ ...checkoutForm, phone: event.target.value })} placeholder="03XX XXXXXXX" /></label>
                    <div className="checkout-split">
                      <label>City<input required autoComplete="address-level2" value={checkoutForm.city} onChange={event => setCheckoutForm({ ...checkoutForm, city: event.target.value })} placeholder="City" /></label>
                      <label>Country<input value="Pakistan" disabled /></label>
                    </div>
                    <label>Delivery address<textarea required autoComplete="street-address" value={checkoutForm.address} onChange={event => setCheckoutForm({ ...checkoutForm, address: event.target.value })} placeholder="House / street / area" rows={3} /></label>
                    <label>Order note <span>optional</span><textarea value={checkoutForm.notes} onChange={event => setCheckoutForm({ ...checkoutForm, notes: event.target.value })} placeholder="Sizing or delivery note" rows={2} /></label>
                    <div className="delivery-option selected-option">
                      <div><b>Standard delivery</b><small>Across Pakistan · courier timing shown here at launch</small></div>
                      <strong>{shipping === 0 ? 'FREE' : `${formatPrice(shipping)}*`}</strong>
                    </div>
                    <button className="button full-button" type="submit">CONTINUE TO PAYMENT <ArrowRight size={18} /></button>
                  </form>
                ) : (
                  <div className="payment-step">
                    <button className="checkout-back" onClick={() => setCheckoutStep('details')}><ArrowLeft size={16} /> EDIT DELIVERY</button>
                    <div className="checkout-section-heading"><h3>payment</h3><p>Choose how you want to finish the order.</p></div>
                    <label className={`payment-option ${paymentMethod === 'cod' ? 'selected-option' : ''}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                      <span><b>Cash on delivery</b><small>Pay when the courier arrives.</small></span>
                    </label>
                    <label className={`payment-option ${paymentMethod === 'online' ? 'selected-option' : ''}`}>
                      <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                      <span><b>Online payment</b><small>Card / wallet gateway connects here in production.</small></span>
                    </label>
                    {paymentMethod === 'online' && <div className="gateway-placeholder"><span>SECURE PAYMENT GATEWAY</span><p>This prototype deliberately does not collect card or wallet credentials.</p></div>}
                    <div className="checkout-order-summary">
                      <div><span>{count} {count === 1 ? 'item' : 'items'}</span><strong>{formatPrice(subtotal)}</strong></div>
                      <div><span>Delivery</span><strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong></div>
                      <div><span>Total</span><strong>{formatPrice(total)}</strong></div>
                    </div>
                    <button className="button full-button" onClick={placeDemoOrder}>PLACE DEMO ORDER <ArrowRight size={18} /></button>
                    <p className="checkout-note">No payment, order, or personal information leaves this browser in the concept build.</p>
                  </div>
                )}
              </div>
            )}

            {panel === 'confirmation' && lastOrder && (
              <div className="confirmation">
                <span className="confirmation-mark"><Check size={30} /></span>
                <p className="accent">done, shawty ♡</p>
                <h2 id="dialog-title" tabIndex={-1}>order received.</h2>
                <p>This is the full post-checkout state customers would see after a successful order.</p>
                <div className="confirmation-card">
                  <div><span>REFERENCE</span><strong>{lastOrder.reference}</strong></div>
                  <div><span>PAYMENT</span><strong>{lastOrder.method === 'cod' ? 'Cash on delivery' : 'Online payment'}</strong></div>
                  <div><span>TOTAL</span><strong>{formatPrice(lastOrder.total)}</strong></div>
                </div>
                <p className="confirmation-note">Production version: send order confirmation by email/SMS/WhatsApp and connect the order to the store backend.</p>
                <a className="button full-button" href="#shop" onClick={event => navigateAfterClose(event, '#shop')}>KEEP SHOPPING <ArrowRight size={18} /></a>
                <a className="text-link" href={instagram} target="_blank" rel="noreferrer">VISIT @SHAWTYSLAYZ <ArrowUpRight size={17} /></a>
              </div>
            )}

            {panel === 'help' && (
              <>
                <h2 id="dialog-title" tabIndex={-1}>{helpText[topic]?.title ?? `${topic}.`}</h2>
                <p className="help-copy">{helpText[topic]?.body}</p>
                {helpText[topic]?.note && <p className="help-note">{helpText[topic].note}</p>}
                {topic === 'contact' ? (
                  <a className="button" href={instagram} target="_blank" rel="noreferrer">DM SHAWTYSLAYZ <ArrowUpRight size={18} /></a>
                ) : (
                  <div className="help-actions"><button className="text-link" onClick={() => { setTopic('contact'); openPanel('help'); }}>NEED HELP? ASK THE BRAND <ArrowRight size={17} /></button></div>
                )}
              </>
            )}
          </ShopOverlay>
        )}
      </AnimatePresence>
    </ShopContext.Provider>
  );
}

export function ProductGrid() {
  const { view } = useShop();
  return (
    <div className="product-grid">
      {products.slice(0, 3).map(product => (
        <article key={product.id} className="product-card" id={product.id === 'tee' ? 'tops' : undefined}>
          <button className="product-image-button" onClick={() => view(product)} aria-label={`Quick shop ${product.name}`}>
            <Photo name={product.image} alt={product.alt} sizes="(max-width: 767px) 82vw, 33vw" />
            <span className="product-open" aria-hidden="true"><span>QUICK SHOP</span><Plus size={18} /></span>
          </button>
          <div className="product-info">
            <div>
              <h3><button onClick={() => view(product)}>{product.name}</button></h3>
              <p>{product.color}</p>
            </div>
            <strong>{formatPrice(product.price)}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ViewPiece({ id, children, className = 'text-link' }: { id: string; children: ReactNode; className?: string }) {
  const { view } = useShop();
  return <button className={className} onClick={() => view(products.find(product => product.id === id) ?? products[0])}>{children}</button>;
}

export function MatchButton() {
  const { match } = useShop();
  return <button className="button" onClick={match}>FIND YOUR PAIR <ArrowUpRight size={18} /></button>;
}

export function FinderButton({ className = 'text-link', children }: { className?: string; children?: ReactNode }) {
  const { finder } = useShop();
  return <button className={className} onClick={finder}>{children ?? <>FIND YOUR PAIR <ArrowRight size={17} /></>}</button>;
}

export function HelpLink({ topic, children }: { topic: string; children?: ReactNode }) {
  const { help } = useShop();
  return <button onClick={() => help(topic)}>{children ?? topic}</button>;
}

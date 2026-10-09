import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Photo } from '@/components/photo';
import { FinderButton, HelpLink, MatchButton, ProductGrid, ShopProvider, ViewPiece } from '@/components/shop';
import { instagram } from '@/lib/products';

export default function Home() {
  return (
    <ShopProvider>
      <main id="main" tabIndex={-1}>
        <section className="hero container" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="accent hero-kicker">hey shawty ♡</p>
            <h1 id="hero-title">
              <span className="hero-line"><span>cute looks</span></span>
              <span className="hero-line hero-middle"><span>better with</span></span>
              <span className="hero-line hero-attitude"><span>attitude.</span></span>
            </h1>
            <p className="hero-description">Printed pairs made for saved folders, mirror pics, and the outfits you actually repeat.</p>
            <div className="hero-links">
              <a className="button" href="#shop">SHOP THE DROP <ArrowRight size={18} /></a>
              <FinderButton>FIND YOUR PAIR <ArrowRight size={17} /></FinderButton>
            </div>
            <div className="hero-facts" aria-label="Shopping information">
              <span>Size help available</span>
              <span>Customization available</span>
              <span>Delivery across Pakistan</span>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-frame" aria-hidden="true" />
            <Photo
              name="hero-cute-trouser-campaign"
              alt="White kitty and pink bow trousers styled with a fitted black top and cream sneakers"
              priority
              className="hero-photo"
              sizes="(max-width: 767px) 100vw, 54vw"
            />
          </div>

          <div className="hero-product" aria-hidden="true">
            <Photo name="cute-trouser-product" alt="" sizes="180px" />
          </div>
        </section>

        <section className="current-edit container" id="shop" aria-labelledby="shop-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">SHOP THE DROP</p>
              <h2 id="shop-title">the current edit.</h2>
            </div>
            <p>Quick shop, pick a size, add to bag, and check out here.</p>
          </div>
          <ProductGrid />
        </section>

        <section className="trust-strip container" aria-label="Why shop SHAWTYSLAYZ">
          <HelpLink topic="sizing"><span>01</span><b>SIZE HELP</b><small>Fit notes before you buy.</small></HelpLink>
          <HelpLink topic="shipping"><span>02</span><b>PAKISTAN-WIDE DELIVERY</b><small>Shipping shown before checkout.</small></HelpLink>
          <a href={instagram} target="_blank" rel="noreferrer"><span>03</span><b>CUSTOMIZATION</b><small>Ask for the version you have in mind.</small></a>
          <HelpLink topic="orders"><span>04</span><b>CLEAR ORDER FLOW</b><small>Bag → checkout → confirmation.</small></HelpLink>
        </section>

        <section className="cute-editorial container" id="trousers" aria-labelledby="cute-title">
          <div className="cute-detail-wrap">
            <Photo name="cute-trouser-detail" alt="Pink bows and kitty print, seen up close in the fabric folds" className="cute-detail" sizes="(max-width: 767px) 100vw, 58vw" />
          </div>
          <div className="cute-copy">
            <p className="cute-kicker">WHITE / PINK</p>
            <h2 id="cute-title">your next<br />fav pair.</h2>
            <p>Relaxed wide leg, elastic waist, and a print that does the work for you.</p>
            <ul className="editorial-facts" aria-label="Kitty trouser details">
              <li>XS–XL</li><li>Relaxed fit</li><li>Easy everyday weight</li>
            </ul>
            <ViewPiece id="kitty">QUICK SHOP <ArrowUpRight size={17} /></ViewPiece>
          </div>
          <div className="cute-product">
            <Photo name="cute-trouser-product" alt="Full white and pink kitty print wide-leg trousers" sizes="(max-width: 767px) 46vw, 300px" />
          </div>
        </section>

        <section className="mood-section" id="dark-drop" aria-labelledby="mood-title">
          <div className="mood-layout container">
            <div className="mood-copy">
              <p className="mood-kicker">BLACK / YELLOW</p>
              <h2 id="mood-title">same cute.<br /><span>different mood.</span></h2>
              <p>Same easy silhouette. Black-and-yellow bat print when the fit needs a little more bite.</p>
              <ul className="editorial-facts dark-facts" aria-label="Bat trouser details">
                <li>XS–XL</li><li>Relaxed fit</li><li>Statement print</li>
              </ul>
              <ViewPiece id="bat" className="mood-link">QUICK SHOP <ArrowUpRight size={17} /></ViewPiece>
            </div>
            <div className="mood-campaign">
              <Photo name="dark-trouser-campaign" alt="Black and yellow bat print trousers styled with a black top" className="mood-photo" sizes="(max-width: 767px) 100vw, 48vw" />
            </div>
            <div className="mood-product">
              <Photo name="dark-trouser-product" alt="The black and yellow printed wide-leg pair, shown flat" sizes="(max-width: 767px) 42vw, 275px" />
            </div>
          </div>
        </section>

        <section className="matching-wrap" id="matching" aria-labelledby="matching-title">
          <div className="matching-section container">
            <div className="matching-media">
              <Photo name="matching-fits-duo" alt="Two people laughing together in matching white kitty and black bat print trousers" className="matching-image" sizes="(max-width: 767px) 100vw, 60vw" />
              <span className="matching-us accent" aria-hidden="true">us?</span>
              <span className="matching-note accent" aria-hidden="true">same vibe, different pair ♡</span>
            </div>
            <div className="matching-copy">
              <p className="section-kicker">THE TWO-TAP FIT FINDER</p>
              <h2 id="matching-title">match their<br />energy.</h2>
              <p>Pick the mood, pick the plan, and we’ll point you to the pair that makes sense.</p>
              <MatchButton />
              <span className="finder-proof">Two questions. No fake personality quiz.</span>
            </div>
          </div>
        </section>

        <section className="community container" aria-labelledby="community-title">
          <div className="community-heading">
            <div>
              <p className="section-kicker">ON THE FEED</p>
              <h2 id="community-title">see the fits,<br />then make yours.</h2>
            </div>
            <div>
              <p>The feed is where drop updates, styling ideas, and tagged looks belong. The store handles the shopping part.</p>
              <a className="text-link" href={instagram} target="_blank" rel="noreferrer">OPEN INSTAGRAM <ArrowUpRight size={17} /></a>
            </div>
          </div>
          <div className="community-grid">
            <a href={instagram} target="_blank" rel="noreferrer" className="community-card tall">
              <Photo name="social-look-01" alt="Black printed lounge trousers styled with a fitted black top" sizes="(max-width: 767px) 80vw, 34vw" />
              <span>fit check ↗</span>
            </a>
            <a href={instagram} target="_blank" rel="noreferrer" className="community-card">
              <Photo name="cute-trouser-detail" alt="Close-up of the white and pink kitty print" sizes="(max-width: 767px) 80vw, 30vw" />
              <span>print close-up ↗</span>
            </a>
            <a href={instagram} target="_blank" rel="noreferrer" className="community-card">
              <Photo name="matching-fits-duo" alt="Matching printed trouser looks" sizes="(max-width: 767px) 80vw, 30vw" />
              <span>matching energy ↗</span>
            </a>
          </div>
        </section>

        <section className="closing container" aria-label="More from SHAWTYSLAYZ">
          <div className="closing-look">
            <Photo name="plaid-lounge-lifestyle" alt="An off-duty look in grey checkered lounge trousers" className="closing-photo" sizes="(max-width: 767px) 100vw, 42vw" />
            <div className="closing-caption"><span>off-duty.</span><ViewPiece id="plaid">QUICK SHOP <ArrowUpRight size={15} /></ViewPiece></div>
          </div>

          <div className="closing-side">
            <div className="customization">
              <p className="section-kicker">MAKE IT YOURS</p>
              <h2>want it<br />your way?</h2>
              <p>Have a print, colour, or sizing request in mind? Keep customization personal and handle the specifics with the brand.</p>
              <a className="text-link" href={instagram} target="_blank" rel="noreferrer">ASK ABOUT CUSTOMIZATION <ArrowUpRight size={18} /></a>
            </div>

            <div className="order-preview">
              <p className="section-kicker">FROM “I WANT IT” TO ORDERED</p>
              <h2>shopping should<br />feel obvious.</h2>
              <ol>
                <li><span>01</span><p><b>Pick the piece.</b> See fit, fabric, size help, and price.</p></li>
                <li><span>02</span><p><b>Build your bag.</b> Size and quantity stay attached to each item.</p></li>
                <li><span>03</span><p><b>Check out.</b> Delivery details, payment choice, then confirmation.</p></li>
              </ol>
              <HelpLink topic="orders">SEE THE ORDER FLOW <ArrowRight size={17} /></HelpLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-intro">
              <a className="wordmark" href="#home">SHAWTYSLAYZ</a>
              <p>Cute fits. Matching energy.<br />Built to shop, not just scroll.</p>
            </div>
            <div className="footer-column"><h3>SHOP</h3><a href="#shop">The drop</a><a href="#trousers">Trousers</a><a href="#matching">Find your pair</a><a href="#tops">Tops</a></div>
            <div className="footer-column"><h3>HELP</h3><HelpLink topic="sizing" /><HelpLink topic="shipping" /><HelpLink topic="returns">exchanges & returns</HelpLink><HelpLink topic="orders">order help</HelpLink><HelpLink topic="contact" /></div>
            <div className="footer-column"><h3>STORE</h3><HelpLink topic="privacy" /><HelpLink topic="terms" /><a href={instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 SHAWTYSLAYZ</span>
            <span>Concept preview · sample pricing · checkout does not process payment</span>
          </div>
        </div>
      </footer>
    </ShopProvider>
  );
}

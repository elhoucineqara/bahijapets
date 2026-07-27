"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Star, Check, AlertTriangle, Bell, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CommentsSection from '@/components/CommentsSection';
import { useTheme } from '@/hooks/useTheme';
import styles from './product.module.css';

export default function ProductDetailClient({ product, relatedProducts }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  if (!product) {
    return (
      <div className={styles.productPage}>
        <Navbar theme={theme} toggleTheme={toggleTheme} hideSearch />
        <div className="container">
          <div className={styles.errorContainer}>
            <AlertTriangle size={48} className={styles.conIcon} />
            <h2>Product Not Found</h2>
            <p>The product you are looking for does not exist or has been removed.</p>
            <Link href="/products" className="btn btn-primary">
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { title, description, price, category, rating, image, images = [], affiliateUrl, features, pros, cons } = product;

  const [activeImage, setActiveImage] = useState(image);
  
  // Alert State
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [alertStatus, setAlertStatus] = useState('idle'); // idle, loading, success, error
  const [alertMessage, setAlertMessage] = useState('');

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setAlertStatus('loading');
    
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          productTitle: title,
          email,
          currentPrice: price
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to create alert');
      
      setAlertStatus('success');
      setAlertMessage('Alert created! We will notify you if the price drops.');
      setTimeout(() => setShowModal(false), 3000);
    } catch (err) {
      setAlertStatus('error');
      setAlertMessage(err.message);
    }
  };

  useEffect(() => {
    setActiveImage(image);
  }, [image]);

  useEffect(() => {
    if (product && product._id) {
      const viewedKey = `viewed_${product._id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, 'true');
        fetch('/api/track-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id, action: 'view' })
        }).catch(console.error);
      }
    }
  }, [product]);

  const handleTrackClick = () => {
    if (product && product._id) {
      fetch('/api/track-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, action: 'click' })
      }).catch(console.error);
    }
  };

  const renderStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalf = ratingValue % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={16} fill="currentColor" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<Star key={i} size={16} fill="currentColor" />);
      } else {
        stars.push(<Star key={i} size={16} className={styles.ratingEmptyStar} />);
      }
    }
    return stars;
  };

  return (
    <div className={styles.productPage}>
      <div className="bg-glow-container">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
      </div>

      <Navbar theme={theme} toggleTheme={toggleTheme} hideSearch />

      <main className={`container ${styles.mainContent}`}>
        <Link href="/products" className={styles.backLink}>
          <ArrowLeft size={18} /> Back to all products
        </Link>

        <div className={styles.grid}>
          {/* Left Column: Image and Pricing/Buy Box */}
          <div className={styles.leftCol}>
            <div className={`${styles.imageCard} glass-card`}>
              <img src={activeImage} alt={title} className={styles.productImage} />
            </div>

            {images && images.length > 1 && (
              <div className={styles.thumbnailGallery}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`${styles.thumbnailBtn} ${activeImage === img ? styles.thumbnailActive : ''}`}
                  >
                    <img src={img} alt="" className={styles.thumbnailImg} />
                  </button>
                ))}
              </div>
            )}

            <div className={`${styles.pricingCard} glass-card`}>
              <div className={styles.priceInfo}>
                <span className={styles.priceLabel}>Estimated Price</span>
                <span className={styles.priceValue}>${price.toFixed(2)}</span>
              </div>

              <a 
                href={product.affiliateUrl} 
                target="_blank" 
                rel="noreferrer" 
                className={`btn btn-buy ${styles.buyBtn}`}
                onClick={handleTrackClick}
              >
                View Offer <ExternalLink size={18} />
              </a>

              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', marginTop: '12px' }}
                onClick={() => { setShowModal(true); setAlertStatus('idle'); setEmail(''); }}
              >
                <Bell size={18} /> Alert me when price drops
              </button>
              
              <div className={styles.affiliateDisclosure}>
                * Prices are estimated and may vary on the partner store. By purchasing through this link, we may earn a small commission at no extra cost to you.
              </div>
            </div>
          </div>

          {/* Right Column: Title, Review, Pros/Cons */}
          <div className={styles.rightCol}>
            <header className={styles.header}>
              <span className={`${styles.categoryBadge} badge badge-primary`}>{category}</span>
              <h1 className={styles.title}>{title}</h1>
              <div className={styles.ratingRow}>
                <div className={styles.ratingStars}>{renderStars(rating)}</div>
                <span>{rating} out of 5 stars</span>
              </div>
            </header>

            {/* Overview */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Expert Review & Overview</h2>
              <p className={styles.description}>{description}</p>
            </section>

            {/* Features */}
            {features && features.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Key Features</h2>
                <ul className={styles.featuresList}>
                  {features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Pros & Cons */}
            <section className={styles.prosConsGrid}>
              {pros && pros.length > 0 && (
                <div className={`${styles.prosConsCard} ${styles.prosCard} glass-card`}>
                  <h3 className={`${styles.feedbackTitle} ${styles.proTitle}`}>
                    <Check size={18} /> Pros
                  </h3>
                  <ul className={styles.feedbackList}>
                    {pros.map((pro, idx) => (
                      <li key={idx} className={styles.feedbackItem}>
                        <Check size={16} className={styles.proIcon} />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {cons && cons.length > 0 && (
                <div className={`${styles.prosConsCard} ${styles.consCard} glass-card`}>
                  <h3 className={`${styles.feedbackTitle} ${styles.conTitle}`}>
                    <AlertTriangle size={18} /> Cons
                  </h3>
                  <ul className={styles.feedbackList}>
                    {cons.map((con, idx) => (
                      <li key={idx} className={styles.feedbackItem}>
                        <AlertTriangle size={16} className={styles.conIcon} />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Related Products You Might Like</h2>
            <div className="product-grid">
              {relatedProducts.map((prod) => (
                <ProductCard
                  key={prod._id.toString()}
                  product={{
                    ...prod,
                    _id: prod._id.toString() // Convert ObjectId to string for compatibility
                  }}
                  onSelect={() => {
                    router.push(`/product/${prod._id}`);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        <CommentsSection 
          entityId={product._id} 
          entityType="product" 
          entityTitle={product.title} 
        />
      </main>

      {/* Alert Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ padding: '30px', maxWidth: '400px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={20} color="var(--accent-gold)" /> Price Drop Alert</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              We'll send you an email as soon as the price for <strong>{title}</strong> drops below ${price.toFixed(2)}.
            </p>
            
            {alertStatus === 'success' ? (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                <Check size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> {alertMessage}
              </div>
            ) : (
              <form onSubmit={handleCreateAlert}>
                <input 
                  type="email" 
                  required 
                  className="form-input" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginBottom: '16px' }}
                />
                {alertStatus === 'error' && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '12px' }}>{alertMessage}</p>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={alertStatus === 'loading'}>
                  {alertStatus === 'loading' ? <Loader2 size={18} className="animate-spin" /> : 'Set Alert'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

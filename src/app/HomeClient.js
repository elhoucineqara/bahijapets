"use client";

import { Dog, Cat, Bone, FolderDot, Flame, ArrowRight, ShieldCheck, TrendingUp, Users, CheckCircle, Search, Settings, Star, ChevronRight, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import AnimatedSection from '@/components/AnimatedSection';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';
import { useState, useMemo } from 'react';
import styles from './home.module.css';

export default function HomeClient({ categories, subcategories, hotDeals, latestArticles = [], testimonials = [] }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');

  const categoriesList = useMemo(() => {
    return Array.from(new Set(hotDeals.map(p => p.category).filter(Boolean)));
  }, [hotDeals]);

  const filteredDeals = useMemo(() => {
    if (activeCategory === 'All') return hotDeals;
    return hotDeals.filter(p => p.category === activeCategory);
  }, [hotDeals, activeCategory]);

  return (
    <div className={styles.appWrapper}>
      <div className="bg-glow-container">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <Hero />

      {/* Features Section */}
      <section className="container" style={{ marginTop: '80px', marginBottom: '80px' }}>
        <AnimatedSection className="text-center" staggerIndex={1}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Why Pets Love Us</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              We obsess over every ingredient, every squeaker, and every smart sensor to bring you only the absolute best for your furry soulmates.
            </p>
          </div>
        </AnimatedSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          <AnimatedSection staggerIndex={1}>
            <div className={`${styles.featureCard} glass-card`}>
              <div className={styles.featureIcon1}>
                <ShieldCheck size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Pawsitive Quality</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>We only recommend toys and treats that meet our strict standards for pet safety and durability.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection staggerIndex={2}>
            <div className={`${styles.featureCard} glass-card`}>
              <div className={styles.featureIcon2}>
                <TrendingUp size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Sniffing Out Deals</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Our team constantly hunts down the absolute best prices, saving you money for more treats.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection staggerIndex={3}>
            <div className={`${styles.featureCard} glass-card`}>
              <div className={styles.featureIcon3}>
                <Users size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Loved by Pet Parents</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Join thousands of happy owners who trust our playful guides for their furry friends every day.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Catalogues Selector */}
      <section id="categories" className={`${styles.catalogSelectorSection} container`}>
        <AnimatedSection staggerIndex={1}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
              Explore Our World
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              From high-tech feeders to ultra-cozy cat trees, pick a collection and dive in.
            </p>
          </div>
        </AnimatedSection>
        <div className={styles.catalogSelectorGrid}>
          {categories && categories.filter(c => !c.parentSlug).slice(0, 6).map((cat, index) => {
            const icons = [FolderDot, Star, Flame, Settings, Dog, Cat, Bone];
            const Icon = icons[index % icons.length];
            const classes = [styles.catalogCardTech, styles.catalogCardBeds, styles.catalogCardToys];
            const cardClass = classes[index % classes.length] || '';
            
            return (
              <AnimatedSection key={cat.slug} staggerIndex={index + 1}>
                <div 
                  className={`${styles.catalogSelectCard} ${cardClass}`}
                  onClick={() => router.push(`/products?category=${cat.slug}`)}
                  style={{ height: '100%' }}
                >
                  <div className={styles.catalogIconWrapper}>
                    <Icon size={32} />
                  </div>
                  <div className={styles.catalogInfoWrapper}>
                    <h3>{cat.name}</h3>
                    {(() => {
                      const subs = subcategories ? subcategories.filter(c => c.parentSlug === cat.slug) : [];
                      if (subs.length > 0) {
                        return (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                            {subs.map(sub => (
                              <span key={sub.slug} style={{
                                fontSize: '0.75rem',
                                padding: '4px 10px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '20px',
                                color: 'var(--text-secondary)'
                              }}>
                                {sub.name}
                              </span>
                            ))}
                          </div>
                        );
                      }
                      return <p>{cat.description || 'Explore our curated selection for this category.'}</p>;
                    })()}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '40px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', marginBottom: '40px' }}>
        <AnimatedSection staggerIndex={1} className="container">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>How We Pamper</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Three fluid steps to pet parent perfection.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', position: 'relative' }}>
            <AnimatedSection staggerIndex={1} className={`flex-1 ${styles.stepCard} ${styles.stepCard1}`} style={{ flex: '1 1 250px', maxWidth: '300px' }}>
              <div className={styles.stepIcon}>1</div>
              <h3>Search & Filter</h3>
              <p>Use our advanced filters to narrow down products by your exact needs and budget.</p>
            </AnimatedSection>
            <AnimatedSection staggerIndex={2} className={`flex-1 ${styles.stepCard} ${styles.stepCard2}`} style={{ flex: '1 1 250px', maxWidth: '300px' }}>
              <div className={styles.stepIcon}>2</div>
              <h3>Read Pros & Cons</h3>
              <p>Dive into our detailed expert reviews to understand the true value of each item.</p>
            </AnimatedSection>
            <AnimatedSection staggerIndex={3} className={`flex-1 ${styles.stepCard} ${styles.stepCard3}`} style={{ flex: '1 1 250px', maxWidth: '300px' }}>
              <div className={styles.stepIcon}>3</div>
              <h3>Buy Smart</h3>
              <p>Click through to the best retailer and complete your purchase with confidence.</p>
            </AnimatedSection>
          </div>
        </AnimatedSection>
      </section>

      {/* Hot Deals Area */}
      <main className={`container ${styles.mainContent}`}>
        <section id="produits" className={styles.productArea} style={{ marginTop: '20px' }}>
          <AnimatedSection staggerIndex={1}>
            <div className={`${styles.resultsHeader}`}>
              <div className={styles.resultsTitleGroup}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={28} style={{ color: '#ff007f' }} fill="#ff007f" />
                  Sizzling Hot Deals
                </h2>
                <p className={styles.catalogDescriptionSub}>
                  A vibrant selection of the most highly-rated, paws-approved gear on the market.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {categoriesList.length > 0 && (
            <div className={styles.categoryFilterContainer} style={{ marginBottom: '24px' }}>
              <span className={styles.filterLabel}>Filter by Category:</span>
              <div className={styles.categoryBadges}>
                <button
                  className={`${styles.categoryBtn} ${activeCategory === 'All' ? styles.categoryBtnActive : ''}`}
                  onClick={() => setActiveCategory('All')}
                >
                  All
                </button>
                {categoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`${styles.categoryBtn} ${activeCategory === cat ? styles.categoryBtnActive : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredDeals.length > 0 ? (
            <div className="product-grid">
              {filteredDeals.map((product, index) => (
                <AnimatedSection key={product._id} staggerIndex={(index % 4) + 1}>
                  <ProductCard 
                    product={product} 
                    onSelect={(prod) => router.push(`/product/${prod._id}`)} 
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection staggerIndex={1}>
              <div className={`${styles.emptyResults} glass-card`}>
                <div className={styles.emptyIconWrapper}>
                  <Flame size={40} />
                </div>
                <h3>Deals are cooling down...</h3>
                <p>We're hunting for the best new deals right now. Check back soon for sizzling offers!</p>
              </div>
            </AnimatedSection>
          )}
        </section>

        {/* Latest Articles Section */}
        {latestArticles && latestArticles.length > 0 && (
          <section style={{ marginTop: '40px', marginBottom: '20px' }}>
            <AnimatedSection staggerIndex={1}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Vibrant Guides & Insights</h2>
              <Link href="/blog" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {latestArticles.map((article, index) => (
                <AnimatedSection key={article._id} staggerIndex={(index % 3) + 1} style={{ height: '100%' }}>
                  <Link href={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                    <div className={styles.articleCard}>
                      {article.image && (
                        <div className={styles.articleImageWrapper}>
                          <div className={styles.articleImage} style={{ backgroundImage: `url(${article.image})` }} />
                        </div>
                      )}
                      <div className={styles.articleContent}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', lineHeight: '1.4' }}>{article.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, margin: 0 }}>{article.seoDescription}</p>
                        <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700' }}>Read Guide &rarr;</div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
            </AnimatedSection>
          </section>
        )}

        {/* Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <section style={{ marginTop: '80px', marginBottom: '40px' }}>
            <AnimatedSection staggerIndex={1}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>What Our Users Say</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Join thousands of smart shoppers.</p>
              </div>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {testimonials.map((t, index) => (
                <AnimatedSection key={t._id} staggerIndex={(index % 3) + 1} style={{ height: '100%' }}>
                  <div className="glass-card" style={{ height: '100%', padding: '30px', borderRadius: 'var(--border-radius-lg)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: 'var(--accent-gold)', display: 'flex', gap: '4px', marginBottom: '16px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={18} fill={i < t.rating ? "currentColor" : "none"} color={i < t.rating ? "var(--accent-gold)" : "var(--text-muted)"} />
                      ))}
                    </div>
                    <p style={{ fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6, flex: 1 }}>"{t.content}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{t.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action for All Products */}
        <AnimatedSection staggerIndex={1}>
          <section className={styles.ctaSection}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>
              Looking for something else?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
              Explore our complete database of reviewed pet products and compare features, prices, pros, and cons.
            </p>
            <Link href="/products" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Browse All Products <ArrowRight size={16} />
            </Link>
          </section>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}

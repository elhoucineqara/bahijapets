"use client";

import { useState, useMemo } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CustomSelect from '@/components/CustomSelect';
import { useTheme } from '@/hooks/useTheme';
import styles from './catalog.module.css';

export default function CatalogClient({ catalog, products }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');

  if (!catalog) {
    return (
      <div className={styles.catalogPage}>
        <Navbar theme={theme} toggleTheme={toggleTheme} hideSearch />
        <div className="container">
          <div className={styles.errorContainer}>
            <AlertTriangle size={48} className={styles.conIcon} style={{ color: 'var(--danger)' }} />
            <h2>Catalog Not Found</h2>
            <p>The collection you are looking for does not exist or has been removed.</p>
            <Link href="/products" className="btn btn-primary">
              Browse All Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get unique categories for products in this catalog
  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Determine banner theme class
  let bannerClass = styles.banner;
  if (catalog.slug === 'dog-essentials') bannerClass += ` ${styles.bannerDogEssentials}`;
  else if (catalog.slug === 'cat-trees') bannerClass += ` ${styles.bannerCatTrees}`;
  else if (catalog.slug === 'pet-tech') bannerClass += ` ${styles.bannerPetTech}`;

  // Filter and Sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    // Category Filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <div className={styles.catalogPage}>
      <div className="bg-glow-container">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
      </div>

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className={`container ${styles.mainContent}`}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={18} /> Back to Home
        </Link>

        {/* Catalog Banner */}
        <section className={bannerClass}>
          <h1 className={styles.title}>{catalog.name}</h1>
          <p className={styles.description}>{catalog.description}</p>
        </section>

        {/* Filters and Sorting bar */}
        <div className={styles.filterBar}>
          {categories.length > 0 && (
            <div className={styles.categories}>
              <button
                className={`${styles.categoryBtn} ${activeCategory === 'All' ? styles.categoryBtnActive : ''}`}
                onClick={() => setActiveCategory('All')}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryBtn} ${activeCategory === cat ? styles.categoryBtnActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 20 }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sort by:</span>
            <CustomSelect
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              options={[
                { value: 'rating-desc', label: 'Highest Rated' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
              ]}
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={(prod) => router.push(`/product/${prod._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>No products found in this category</h3>
            <button className="btn btn-secondary" onClick={() => setActiveCategory('All')} style={{ marginTop: '16px' }}>
              Show All Categories
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

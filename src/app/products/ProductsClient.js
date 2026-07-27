"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Flame, SlidersHorizontal, RefreshCw, X, Filter, SearchX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CustomSelect from '@/components/CustomSelect';
import { useTheme } from '@/hooks/useTheme';
import styles from './products.module.css';

export default function ProductsClient({ initialProducts, categories = [], subcategories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();

  // URL Query Parameters
  const urlCatalog = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';

  // Filter & Search State
  const [searchVal, setSearchVal] = useState(urlSearch);
  const [activeCatalog, setActiveCatalog] = useState(urlCatalog);
  const [activeCategory, setActiveCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [onlyHotDeals, setOnlyHotDeals] = useState(false);
  const [sortBy, setSortBy] = useState('rating-desc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedParents, setExpandedParents] = useState({});

  const toggleParent = (slug) => {
    setExpandedParents(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Sync state with URL changes (e.g. searching from navbar on another page)
  useEffect(() => {
    setSearchVal(urlSearch);
    setActiveCatalog(urlCatalog);
  }, [urlSearch, urlCatalog]);

  // Determine the highest price to set the slider maximum
  const absoluteMaxPrice = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return 1000;
    return Math.ceil(Math.max(...initialProducts.map(p => p.price)));
  }, [initialProducts]);

  // Initialize maxPrice slider once products are loaded
  useEffect(() => {
    setMaxPrice(absoluteMaxPrice);
  }, [absoluteMaxPrice]);

  // Get categories based on selected category
  const dynamicCategories = useMemo(() => {
    const filteredByCatalog = activeCatalog === 'All' 
      ? initialProducts 
      : initialProducts.filter(p => p.categorySlug === activeCatalog || p.subcategorySlug === activeCatalog);
    
    const uniqueCategories = Array.from(new Set(filteredByCatalog.map(p => p.category))).filter(Boolean);
    return uniqueCategories;
  }, [initialProducts, activeCatalog]);

  // Reset category if it's not available in the selected category
  useEffect(() => {
    if (activeCategory !== 'All' && !dynamicCategories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [activeCatalog, dynamicCategories, activeCategory]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Category Filter
    if (activeCatalog !== 'All') {
      result = result.filter(p => p.categorySlug === activeCatalog || p.subcategorySlug === activeCatalog);
    }

    // 2. Category Filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // 3. Search Filter
    if (searchVal) {
      const query = searchVal.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // 4. Price Filter
    result = result.filter(p => p.price <= maxPrice);

    // 5. Hot Deals Filter
    if (onlyHotDeals) {
      result = result.filter(p => p.isHotDeal);
    }

    // 6. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'hot-first') {
      result.sort((a, b) => (b.isHotDeal ? 1 : 0) - (a.isHotDeal ? 1 : 0));
    }

    return result;
  }, [initialProducts, activeCatalog, activeCategory, searchVal, maxPrice, onlyHotDeals, sortBy]);

  const handleResetFilters = () => {
    setSearchVal('');
    setActiveCatalog('All');
    setActiveCategory('All');
    setMaxPrice(absoluteMaxPrice);
    setOnlyHotDeals(false);
    setSortBy('rating-desc');
    router.push('/products');
  };

  const handleCatalogSelect = (slug) => {
    setActiveCatalog(slug);
    // Sync to URL
    const params = new URLSearchParams(window.location.search);
    if (slug === 'All') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className={styles.productsPage}>
      <div className="bg-glow-container">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
      </div>

      <Navbar 
        searchVal={searchVal} 
        setSearchVal={setSearchVal} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      <main className={`container ${styles.mainContent}`}>
        <header className={styles.header}>
          <h1 className={styles.title}>All Curated Deals & Products</h1>
          <p className={styles.subtitle}>
            Filter through our expert recommendations to find exactly what you need.
          </p>
        </header>

        <div className={styles.layout}>
          {/* Mobile Overlay */}
          <div 
            className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.open : ''}`} 
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar Filters */}
          <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
            <div className={`${styles.filterCard} glass-card`}>
              {/* Mobile Close Btn */}
              <button className={styles.closeSidebarBtn} onClick={() => setIsSidebarOpen(false)}>
                <span>Filters</span>
                <X size={20} />
              </button>

              {/* Search Section (Mobile/Tablet helper) */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Search</h3>
                <div className={styles.searchWrapper}>
                  <Search size={18} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Keywords..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              {/* Hierarchical Collections */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Collections</h3>
                <div className={styles.filterList}>
                  <span 
                    className={`${styles.filterOption} ${activeCatalog === 'All' ? styles.filterOptionActive : ''}`}
                    onClick={() => handleCatalogSelect('All')}
                  >
                    All Collections
                  </span>
                  {categories.map((parentCat) => {
                    const hasSubs = categories.some(c => c.parentSlug === parentCat.slug);
                    const isExpanded = expandedParents[parentCat.slug] !== false; // expanded by default
                    
                    return (
                    <div key={parentCat.slug} style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <span
                          className={`${styles.filterOption} ${activeCatalog === parentCat.slug ? styles.filterOptionActive : ''}`}
                          onClick={() => handleCatalogSelect(parentCat.slug)}
                          style={{ fontWeight: 600, marginTop: '6px', flex: 1 }}
                        >
                          {parentCat.name}
                        </span>
                        {hasSubs && (
                          <div 
                            onClick={(e) => { e.stopPropagation(); toggleParent(parentCat.slug); }}
                            style={{ padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {isExpanded && subcategories.filter(s => s.parentSlug === parentCat.slug).map(subCat => (
                        <span
                          key={subCat.slug}
                          className={`${styles.filterOption} ${activeCatalog === subCat.slug ? styles.filterOptionActive : ''}`}
                          onClick={() => handleCatalogSelect(subCat.slug)}
                          style={{ paddingLeft: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                        >
                          ↳ {subCat.name}
                        </span>
                      ))}
                    </div>
                  )})}
                  
                  {/* Any Orphans */}
                  {subcategories.filter(s => !categories.find(p => p.slug === s.parentSlug)).map(orphan => (
                    <span
                      key={orphan.slug}
                      className={`${styles.filterOption} ${activeCatalog === orphan.slug ? styles.filterOptionActive : ''}`}
                      onClick={() => handleCatalogSelect(orphan.slug)}
                    >
                      {orphan.name}
                    </span>
                  ))}</div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className={styles.filterSection}>
                  <h3 className={styles.filterTitle}>Categories</h3>
                  <div className={styles.filterList}>
                    <span 
                      className={`${styles.filterOption} ${activeCategory === 'All' ? styles.filterOptionActive : ''}`}
                      onClick={() => setActiveCategory('All')}
                    >
                      All Categories
                    </span>
                    {dynamicCategories.map((category) => (
                      <span
                        key={category}
                        className={`${styles.filterOption} ${activeCategory === category ? styles.filterOptionActive : ''}`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Max Budget</h3>
                <input
                  type="range"
                  min="0"
                  max={absoluteMaxPrice}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.priceInputs}>
                  <span className={styles.priceRangeLabel}>$0</span>
                  <span className={styles.priceRangeLabel} style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ${maxPrice}
                  </span>
                </div>
              </div>

              {/* Hot Deals */}
              <div className={styles.filterSection}>
                <div 
                  className={`${styles.hotDealToggle} ${onlyHotDeals ? styles.hotDealToggleActive : ''}`}
                  onClick={() => setOnlyHotDeals(!onlyHotDeals)}
                >
                  <Flame size={18} fill={onlyHotDeals ? "currentColor" : "none"} />
                  <span>Only Hot Deals</span>
                </div>
              </div>

              {/* Reset */}
              <button 
                className="btn btn-secondary" 
                onClick={handleResetFilters}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <RefreshCw size={16} /> Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className={styles.contentArea}>
            {/* Top Bar: Count & Sort */}
            <div className={styles.topBar}>
              <button 
                className={styles.mobileFilterToggle}
                onClick={() => setIsSidebarOpen(true)}
              >
                <Filter size={16} /> Filters
              </button>

              <span className={styles.resultsCount} style={{ flex: 1 }}>
                Showing {filteredProducts.length} of {initialProducts.length} products
              </span>

              <div className={styles.sortByWrapper}>
                <span className={styles.sortLabel}>Sort by:</span>
                <CustomSelect 
                  value={sortBy}
                  onChange={(val) => setSortBy(val)}
                  options={[
                    { value: 'rating-desc', label: 'Highest Rated' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                    { value: 'hot-first', label: 'Hot Deals First' }
                  ]}
                />
              </div>
            </div>

            {/* Product Grid */}
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
              <div className={`${styles.emptyState} glass-card animate-fade-in`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '600px', margin: '40px auto' }}>
                <div style={{ background: 'var(--primary-glow)', padding: '20px', borderRadius: '50%', color: 'var(--primary)' }}>
                  <SearchX size={48} />
                </div>
                <h3 className={styles.emptyStateTitle} style={{ fontSize: '1.8rem', margin: 0 }}>No Products Found</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Try adjusting your search terms, changing the category, or raising the price budget.</p>
                <button className="btn btn-primary" onClick={handleResetFilters} style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  Clear All Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminPanel from '@/components/AdminPanel';
import { useTheme } from '@/hooks/useTheme';
import styles from '../../home.module.css';

export default function AdminPage() {
  const params = useParams();
  let activeTab = 'dashboard';
  if (params.tab && params.tab.length > 0) {
    activeTab = params.tab[0];
    if (activeTab === 'catalogs') activeTab = 'categories';
  }

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const fetchData = async () => {
    try {
      setLoading(true);
      const catRes = await fetch('/api/categories');
      if (!catRes.ok) throw new Error("Unable to load categories.");
      const catData = await catRes.json();
      setCategories(catData);

      const subcatRes = await fetch('/api/subcategories');
      if (!subcatRes.ok) throw new Error("Unable to load subcategories.");
      const subcatData = await subcatRes.json();
      setSubcategories(subcatData);

      const prodRes = await fetch('/api/products');
      if (!prodRes.ok) throw new Error("Unable to load products.");
      const prodData = await prodRes.json();
      setProducts(prodData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
      {loading ? (
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh', padding: '20px', gap: '24px', background: 'var(--bg-secondary)' }}>
          <div className="skeleton" style={{ width: '260px', height: 'calc(100vh - 40px)', borderRadius: 'var(--border-radius-lg)', display: 'none' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="skeleton skeleton-title" style={{ width: '200px', height: '32px' }}></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              <div className="skeleton skeleton-card" style={{ height: '160px' }}></div>
              <div className="skeleton skeleton-card" style={{ height: '160px' }}></div>
              <div className="skeleton skeleton-card" style={{ height: '160px' }}></div>
            </div>
            <div className="skeleton skeleton-card" style={{ flex: 1, minHeight: '400px' }}></div>
          </div>
        </div>
      ) : (
        <AdminPanel 
          products={products} 
          categories={categories} 
          subcategories={subcategories}
          onRefresh={fetchData} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          initialTab={activeTab} 
        />
      )}
    </div>
  );
}

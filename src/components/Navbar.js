"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import styles from './Navbar.module.css';

export default function Navbar({ searchVal = '', setSearchVal, theme: propTheme, toggleTheme: propToggleTheme, hideSearch = false, hideNavLinks = false }) {
  const router = useRouter();
  const { theme: hookTheme, toggleTheme: hookToggleTheme } = useTheme();
  
  const theme = propTheme !== undefined ? propTheme : hookTheme;
  const toggleTheme = propToggleTheme !== undefined ? propToggleTheme : hookToggleTheme;

  const [menuOpen, setMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchVal);

  useEffect(() => {
    setLocalSearch(searchVal);
  }, [searchVal]);

  const closeMenu = () => setMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (setSearchVal) {
      setSearchVal(localSearch);
    }
    router.push(`/products?search=${encodeURIComponent(localSearch)}`);
  };

  return (
    <header className={styles.navbarContainer}>
      <div className={`${styles.navbar} container`}>
        <Link href="/" className={styles.navBrand} onClick={closeMenu}>
          <img src="/bahijapetlogo.png" alt="BahijaPets" className={styles.brandLogoImg} />
          <span className={styles.brandName}>Bahija<span className={styles.goldText}>Pets</span></span>
        </Link>

        {!hideSearch && (
          <form onSubmit={handleSearchSubmit} className={styles.navSearchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Search for a product..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={styles.searchInput}
            />
          </form>
        )}

        <nav className={`${styles.navLinks} ${styles.desktopNav}`}>
          {!hideNavLinks && (
            <>
              <Link href="/products" className={styles.navLinkBtn}>All Products</Link>
              <Link href="/blog" className={styles.navLinkBtn}>Blog</Link>
              <Link href="/about" className={styles.navLinkBtn}>About</Link>
            </>
          )}
          <button onClick={toggleTheme} className={styles.themeToggleBtn} aria-label="Change theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        <div className={styles.mobileNavActions}>
          <button onClick={toggleTheme} className={styles.themeToggleBtn} aria-label="Change theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {!hideNavLinks && (
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className={styles.menuToggleBtn}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {menuOpen && !hideNavLinks && (
        <nav className={`${styles.mobileMenu} container`}>
          <Link href="/products" className={styles.mobileNavLink} onClick={closeMenu}>All Products</Link>
          <Link href="/blog" className={styles.mobileNavLink} onClick={closeMenu}>Blog</Link>
          <Link href="/about" className={styles.mobileNavLink} onClick={closeMenu}>About</Link>
        </nav>
      )}
    </header>
  );
}

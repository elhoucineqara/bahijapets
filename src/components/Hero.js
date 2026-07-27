"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
  "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&q=80",
  "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
  "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80",
];

export default function Hero() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBackground}>
        {HERO_IMAGES.map((src, idx) => (
          <img 
            key={src}
            src={src} 
            alt={`Pet hero ${idx}`} 
            className={`${styles.heroBgImage} ${idx === currentIdx ? styles.active : styles.inactive}`} 
          />
        ))}
        <div className={styles.heroOverlay}></div>
      </div>

      <div className={`${styles.heroContent} container animate-fade-in`}>
        <div className={styles.textWrapper}>
          <div className={styles.badgeContainer}>
            <span className={styles.badgeGold}>
              ✨ New: Glowing Summer Collection
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Unleash pure joy for your<br/>
            <span className={styles.primaryText}>best friend</span> today
          </h1>

          <p className={styles.heroDescription}>
            Dive into our vibrant curation of ultra-premium food, interactive toys, and smart accessories. Pampering your pets has never looked this good.
          </p>
          
          <div className={styles.heroActions}>
            <Link href="#categories" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>Explore Now</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

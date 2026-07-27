"use client";

import { Users, Target, ShieldCheck, HelpCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';
import styles from './about.module.css';

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.aboutPage}>
      <div className="bg-glow-container">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
      </div>

      <Navbar theme={theme} toggleTheme={toggleTheme} hideSearch />

      <main className={`container ${styles.mainContent}`}>
        <header className={`${styles.header} animate-fade-in stagger-1`}>
          <h1 className={styles.title}>
            The Heart Behind Bahija<span className={styles.goldText}>Pets</span>
          </h1>
          <p className={styles.subtitle}>
            We're just obsessed with animals. Welcome to your premier destination for the absolute best pet gear, expert care tips, and tail-wagging deals.
          </p>
        </header>

        <section className={styles.grid}>
          {/* Card 1: Who We Are */}
          <div className={`${styles.card} glass-card animate-fade-in stagger-2`}>
            <div className={styles.cardIcon}>
              <Users size={24} />
            </div>
            <h2 className={styles.cardTitle}>Who We Are</h2>
            <p className={styles.cardText}>
              BahijaPets is a vibrant curation platform run by a tight-knit family of pet parents. We spend our days finding the most durable toys, the healthiest treats, and the smartest pet tech so you don't have to.
            </p>
          </div>

          {/* Card 2: Our Mission */}
          <div className={`${styles.card} glass-card animate-fade-in stagger-3`}>
            <div className={styles.cardIcon}>
              <Target size={24} />
            </div>
            <h2 className={styles.cardTitle}>Our Mission</h2>
            <p className={styles.cardText}>
              Spoiling your pet shouldn't empty your wallet. We cut through the noise of sponsored ads and confusing options to bring you honest pros, real cons, and the absolute best prices on the internet.
            </p>
          </div>

          {/* Card 3: How We Review */}
          <div className={`${styles.card} glass-card animate-fade-in stagger-4`}>
            <div className={styles.cardIcon}>
              <ShieldCheck size={24} />
            </div>
            <h2 className={styles.cardTitle}>Our Curation Process</h2>
            <p className={styles.cardText}>
              We are obsessed with quality. If a cat tree is wobbly or a dog bed loses its fluff, we won't list it. We analyze durability, pet-safety, and real user feedback to ensure every product we recommend is a winner.
            </p>
          </div>

          {/* Card 4: Why Trust Us */}
          <div className={`${styles.card} glass-card animate-fade-in stagger-2`}>
            <div className={styles.cardIcon}>
              <HelpCircle size={24} />
            </div>
            <h2 className={styles.cardTitle}>Why Trust Us?</h2>
            <p className={styles.cardText}>
              Because we treat your pets like our own. We never hide the flaws—if a smart feeder is hard to program, we tell you. Absolute transparency is our promise to you and your furry friends.
            </p>
          </div>

          {/* Card 5: Full Width Affiliate Disclosure */}
          <div className={`${styles.card} ${styles.fullWidthCard} glass-card`}>
            <div className={styles.cardIcon}>
              <ShoppingBag size={24} />
            </div>
            <h2 className={styles.cardTitle}>Affiliate Partnership & Transparency</h2>
            <p className={styles.cardText}>
              To keep our service free and avoid intrusive banner ads, BahijaPets is a participant in affiliate advertising programs. This provides a means for sites to earn advertising fees by linking to partner stores.
            </p>
            <p className="about-text" style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              * What this means for you: When you click on one of our product links and make a purchase, we may receive a small commission at no additional cost to you. This helps support our hosting, development, and ongoing product research. Thank you for supporting our work!
            </p>
          </div>
        </section>

        <section className={`${styles.ctaSection} animate-fade-in stagger-4`}>
          <h2 className={styles.ctaTitle}>Ready to spoil them rotten?</h2>
          <p className={styles.ctaText}>
            Explore our vibrant collections of indestructible dog toys, towering cat trees, and automated pet care tech.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/products" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Unleash All Products <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Bark At Us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

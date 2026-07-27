"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };
  return (
    <footer id="apropos" className={styles.footerSection}>
      <div className={`${styles.footerContent} container`}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.brandLogo}>
            <img src="/bahijapetlogo.png" alt="BahijaPets" className={styles.brandLogoImgFooter} />
            <span className={styles.brandName}>Bahija<span className={styles.goldText}>Pets</span></span>
          </Link>
          <p className={styles.brandTagline}>Your trusted guide for the best pet products, smart tech, and expert reviews.</p>
          <div className={styles.footerDisclaimerBox}>
            <p className={styles.disclosure}>
              <strong>Disclosure:</strong> BahijaPets participates in affiliate programs. As an affiliate, we earn from qualifying purchases at no extra cost to you.
            </p>
          </div>
        </div>

        <div className={styles.footerLinksWrapper}>
          <div className={styles.footerLinks}>
            <h4 className={styles.footerLinksTitle}>Explore</h4>
            <Link href="/#categories" className={styles.footerLinkBtn}>Smart Tech</Link>
            <Link href="/products" className={styles.footerLinkBtn}>All Products</Link>
            <Link href="/blog" className={styles.footerLinkBtn}>Guides & Insights</Link>
          </div>

          <div className={styles.footerLinks}>
            <h4 className={styles.footerLinksTitle}>Company</h4>
            <Link href="/about" className={styles.footerLinkBtn}>About Us</Link>
            <Link href="/contact" className={styles.footerLinkBtn}>Contact</Link>
            <Link href="/privacy-policy" className={styles.footerLinkBtn}>Privacy Policy</Link>
            <Link href="/terms-of-service" className={styles.footerLinkBtn}>Terms</Link>
            <Link href="/disclaimer" className={styles.footerLinkBtn}>Disclaimer</Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 className={styles.footerLinksTitle}>Join the Pack</h4>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '16px' }}>
            Get the latest deals, pet care tips, and expert reviews delivered directly to your inbox.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="Enter your email address" 
                required
                className={styles.emailInput}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={status === 'loading'}
                style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--border-radius-sm)' }}
              >
                {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
            {status === 'success' && <div style={{ color: '#10b981', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><CheckCircle size={14}/> {message}</div>}
            {status === 'error' && <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><AlertCircle size={14}/> {message}</div>}
          </form>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} BahijaPets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

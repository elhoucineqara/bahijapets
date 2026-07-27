"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function Disclaimer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="bg-glow-container">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>
      <Navbar theme={theme} toggleTheme={toggleTheme} hideSearch />
      <main className="container animate-fade-in stagger-1" style={{ flex: 1, padding: '120px 20px 80px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '40px', borderRadius: 'var(--border-radius-lg)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--primary)' }}>Affiliate Disclaimer</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Last updated: {new Date().toLocaleDateString()}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>1. General Disclaimer</h2>
              <p>The information contained on BahijaPets is for general information purposes only. BahijaPets assumes no responsibility for errors or omissions in the contents on the Service.</p>
              <p style={{ marginTop: '8px' }}>In no event shall BahijaPets be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service.</p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>2. Affiliate Disclaimer</h2>
              <p>This affiliate disclosure details the affiliate relationships of BahijaPets with other companies and products. Some of the links are "affiliate links", a link with a special tracking code.</p>
              <p style={{ marginTop: '8px' }}>This means if you click on an affiliate link and purchase the item, we will receive an affiliate commission at no extra cost to you.</p>
              <p style={{ marginTop: '8px' }}>The price of the item is the same whether it is an affiliate link or not. Regardless, we only recommend products or services we believe will add value to our readers.</p>
              <p style={{ marginTop: '8px' }}>By using the affiliate links, you are helping support the Service, and we genuinely appreciate your support.</p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>3. External Links Disclaimer</h2>
              <p>BahijaPets may contain links to external websites that are not provided or maintained by or in any way affiliated with BahijaPets.</p>
              <p style={{ marginTop: '8px' }}>Please note that the BahijaPets does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function TermsOfService() {
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--primary)' }}>Terms of Service</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Last updated: {new Date().toLocaleDateString()}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>1. Agreement to Terms</h2>
              <p>By accessing our website at BahijaPets, you agree to be bound by these Terms of Service and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on BahijaPets's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', listStyleType: 'disc' }}>
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on BahijaPets's website;</li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
            </section>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>3. Disclaimer</h2>
              <p>The materials on BahijaPets's website are provided on an 'as is' basis. BahijaPets makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>4. Limitations</h2>
              <p>In no event shall BahijaPets or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BahijaPets's website, even if BahijaPets or a BahijaPets authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>5. Revisions and Errata</h2>
              <p>The materials appearing on BahijaPets's website could include technical, typographical, or photographic errors. BahijaPets does not warrant that any of the materials on its website are accurate, complete, or current. BahijaPets may make changes to the materials contained on its website at any time without notice.</p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>6. Site Terms of Use Modifications</h2>
              <p>BahijaPets may revise these Terms of Service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

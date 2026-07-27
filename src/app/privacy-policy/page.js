"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function PrivacyPolicy() {
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--primary)' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Last updated: {new Date().toLocaleDateString()}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>1. Introduction</h2>
              <p>Welcome to BahijaPets. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>2. Data We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', listStyleType: 'disc' }}>
                <li><strong>Identity Data:</strong> Includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> Includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data:</strong> Includes information about how you use our website, products and services.</li>
              </ul>
            </section>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>3. How We Use Your Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', listStyleType: 'disc' }}>
                <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
                <li>To manage Your Account: to manage Your registration as a user of the Service.</li>
                <li>To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
                <li>To provide You with news, special offers and general information about other goods, services and events which we offer.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>4. Cookies and Tracking Technologies</h2>
              <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.</p>
              <p style={{ marginTop: '8px' }}>Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.</p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, You can contact us:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', listStyleType: 'disc' }}>
                <li>By visiting the contact page on our website.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useState } from 'react';
import { Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';
import styles from './contact.module.css';

export default function ContactPage() {
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSuccess(data.message || 'Message sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="bg-glow-container">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
      </div>

      <Navbar theme={theme} toggleTheme={toggleTheme} hideSearch />

      <main className={`container ${styles.main}`}>
        <div className={`${styles.header} animate-fade-in stagger-1`}>
          <h1 className={styles.title}>Bark At Us!</h1>
          <p className={styles.subtitle}>
            Have a question, suggestion, or just want to show us a picture of your cat? Send us a message and we'll fetch you a reply as soon as possible.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.infoCard} glass-card animate-fade-in stagger-2`}>
            <h2 className={styles.infoTitle}>Contact Information</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Mail size={20} className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Email</p>
                  <p className={styles.infoValue}>contact@qarapets.com</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <MapPin size={20} className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Location</p>
                  <p className={styles.infoValue}>France &amp; Europe</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Clock size={20} className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Response time</p>
                  <p className={styles.infoValue}>Within 24–48 business hours (unless we're walking the dog)</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.formCard} glass-card animate-fade-in stagger-3`}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
              {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

              <div className={styles.row}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject *</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  maxLength={200}
                  value={form.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Product suggestion, partnership..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Write your message here..."
                />
              </div>

              <button type="submit" disabled={loading} className={`btn btn-primary ${styles.submitBtn}`}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

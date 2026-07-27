"use client";

import { useState, useEffect } from 'react';
import { Mail, Loader2, Download, Copy, Check } from 'lucide-react';

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmails = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Email,Subscribed At\n" 
      + subscribers.map(s => `${s.email},${new Date(s.createdAt).toLocaleString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="admin-card glass-card">
        <div className="skeleton skeleton-title" style={{ width: '280px', height: '32px' }}></div>
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton skeleton-text" style={{ height: '40px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '40px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '40px', width: '40%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card glass-card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={24} color="var(--primary)" />
          Newsletter Subscribers ({subscribers.length})
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleCopyEmails} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {copied ? <Check size={16} /> : <Copy size={16} />} Copy All
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>
      
      {subscribers.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No subscribers yet.</div>
      ) : (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Subscribed At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{sub.email}</td>
                  <td>{new Date(sub.createdAt).toLocaleString()}</td>
                  <td><span className="badge badge-primary">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

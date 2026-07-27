"use client";

import { useState, useEffect } from 'react';
import { Bell, Trash2, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AlertsAdmin() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/alerts');
      if (!res.ok) throw new Error("Failed to load alerts");
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;
    try {
      const res = await fetch(`/api/alerts?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete alert");
      fetchAlerts();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-card glass-card">
        <div className="skeleton skeleton-title" style={{ width: '280px', height: '32px' }}></div>
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton skeleton-text" style={{ height: '40px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '40px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card glass-card animate-fade-in">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={24} color="var(--primary)" />
          Price Drop Alerts ({alerts.length})
        </h2>
      </div>
      
      {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Subscriber Email</th>
              <th>Product</th>
              <th>Target Price</th>
              <th>Date Subscribed</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(a => (
              <tr key={a._id}>
                <td><strong>{a.email}</strong></td>
                <td>
                  <Link href={`/product/${a.productId}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'none' }}>
                    {a.productTitle} <ExternalLink size={14} />
                  </Link>
                </td>
                <td><strong style={{ color: 'var(--success)' }}>${a.targetPrice?.toFixed(2)}</strong></td>
                <td style={{ color: 'var(--text-secondary)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="icon-btn danger" onClick={() => handleDelete(a._id)} title="Delete Alert">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {alerts.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No price alerts subscribed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

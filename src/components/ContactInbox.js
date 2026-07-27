"use client";

import { useState, useEffect, useCallback } from 'react';
import { Mail, Trash2, Check, Loader2, RefreshCw, Reply } from 'lucide-react';
import styles from './ContactInbox.module.css';

export default function ContactInbox({ onStatsChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const updateStats = useCallback((list) => {
    if (onStatsChange) {
      onStatsChange({
        total: list.length,
        unread: list.filter((m) => !m.read).length,
      });
    }
  }, [onStatsChange]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/contact');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load messages.');
      }
      const data = await res.json();
      setMessages(data);
      updateStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [updateStats]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error('Failed to update message.');
      setMessages((prev) => {
        const next = prev.map((m) => (String(m._id) === String(id) ? { ...m, read: true } : m));
        updateStats(next);
        return next;
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message permanently?')) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete message.');
      }
      setMessages((prev) => {
        const next = prev.filter((m) => String(m._id) !== String(id));
        updateStats(next);
        return next;
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className={`${styles.card} glass-card`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <Mail size={20} className={styles.headerIcon} />
          <div>
            <h3 className={styles.title}>Contact Messages</h3>
            <p className={styles.subtitle}>
              {messages.length} message(s)
              {unreadCount > 0 && (
                <> · <span className={styles.unreadBadge}>{unreadCount} unread</span></>
              )}
            </p>
          </div>
        </div>
        <button type="button" onClick={fetchMessages} className={`btn btn-secondary ${styles.refreshBtn}`}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className={styles.cardBody}>
        {loading ? (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="skeleton skeleton-title" style={{ width: '30%', height: '24px' }}></div>
            <div className="skeleton skeleton-text" style={{ height: '80px', borderRadius: '8px' }}></div>
            <div className="skeleton skeleton-text" style={{ height: '80px', borderRadius: '8px' }}></div>
            <div className="skeleton skeleton-text" style={{ height: '80px', borderRadius: '8px' }}></div>
          </div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : messages.length === 0 ? (
          <div className={styles.empty}>
            <Mail size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>No contact messages yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '8px', opacity: 0.7 }}>
              Messages sent from the contact page will appear here.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {messages.map((msg) => (
              <article
                key={msg._id}
                className={`${styles.message} ${!msg.read ? styles.messageUnread : ''}`}
              >
                <div className={styles.messageHeader}>
                  <div>
                    <p className={styles.sender}>{msg.name}</p>
                    <p className={styles.email}>{msg.email}</p>
                  </div>
                  <span className={styles.date}>{formatDate(msg.createdAt)}</span>
                </div>
                <p className={styles.subject}>{msg.subject}</p>
                <p className={styles.body}>{msg.message}</p>
                <div className={styles.actions}>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className={`btn btn-buy ${styles.btnSm}`}
                  >
                    <Reply size={14} /> Reply
                  </a>
                  {!msg.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(msg._id)}
                      className={`btn btn-secondary ${styles.btnSm}`}
                    >
                      <Check size={14} /> Mark as read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteMessage(msg._id)}
                    className={`btn btn-danger ${styles.btnSm}`}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

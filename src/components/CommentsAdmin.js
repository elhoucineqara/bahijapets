"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CommentsAdmin() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/comments');
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete comment");
      fetchComments();
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
          <MessageCircle size={24} color="var(--primary)" />
          Comments Moderation ({comments.length})
        </h2>
      </div>
      
      {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Comment</th>
              <th>Posted On</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(c => (
              <tr key={c._id}>
                <td style={{ minWidth: '120px' }}><strong>{c.authorName}</strong></td>
                <td style={{ maxWidth: '300px' }}>
                  <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {c.text}
                  </p>
                </td>
                <td>
                  <span className="badge badge-primary" style={{ marginBottom: '4px' }}>{c.entityType}</span>
                  <Link 
                    href={c.entityType === 'product' ? `/product/${c.entityId}` : `/blog/${c.entityId}`} 
                    target="_blank" 
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.85rem' }}
                  >
                    {c.entityTitle?.substring(0, 30) || 'View Page'} <ExternalLink size={12} />
                  </Link>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="icon-btn danger" onClick={() => handleDelete(c._id)} title="Delete Comment">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No comments posted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

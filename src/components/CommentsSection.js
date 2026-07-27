"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, User, Loader2, Send } from 'lucide-react';

export default function CommentsSection({ entityId, entityType, entityTitle }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/comments?entityId=${entityId}&entityType=${entityType}&status=approved`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      fetchComments();
    }
  }, [entityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !text.trim()) {
      setError("Name and comment are required.");
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          entityType,
          entityTitle,
          authorName,
          text
        })
      });
      
      if (!res.ok) throw new Error("Failed to post comment");
      
      setAuthorName('');
      setText('');
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--glass-border)' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <MessageCircle size={24} color="var(--primary)" />
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', borderRadius: 'var(--border-radius-md)' }}>
        <h4 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Leave a Comment</h4>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Your Name" 
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              style={{ maxWidth: '300px' }}
            />
          </div>
          <div>
            <textarea 
              className="form-textarea" 
              placeholder="What are your thoughts?" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              style={{ minHeight: '100px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Post Comment</>}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 size={32} className="animate-spin" color="var(--primary)" />
          </div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} style={{ display: 'flex', gap: '16px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{comment.authorName}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

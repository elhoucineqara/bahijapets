"use client";

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('list'); // list, add, edit
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error("Failed to load testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAdd = () => {
    setFormData({ name: '', role: '', content: '', rating: 5, active: true });
    setEditingId(null);
    setView('add');
  };

  const handleEdit = (testi) => {
    setFormData({ ...testi });
    setEditingId(testi._id);
    setView('edit');
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete testimonial");
      fetchTestimonials();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = '/api/testimonials';
      const method = editingId ? 'PUT' : 'POST';
      const payload = editingId ? { ...formData, _id: editingId } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save testimonial");
      
      setView('list');
      fetchTestimonials();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} color={i < rating ? "var(--accent-gold)" : "var(--text-muted)"} />
    ));
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

  if (view === 'list') {
    return (
      <div className="admin-card glass-card animate-fade-in">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={24} color="var(--primary)" />
            Testimonials ({testimonials.length})
          </h2>
          <button onClick={handleAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Testimonial
          </button>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Role</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr key={t._id}>
                  <td><strong>{t.name}</strong></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.role || '-'}</td>
                  <td><div style={{ display: 'flex', gap: '2px', color: 'var(--accent-gold)' }}>{renderStars(t.rating)}</div></td>
                  <td>
                    {t.active 
                      ? <span style={{ color: 'var(--success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14}/> Active</span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hidden</span>
                    }
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className="icon-btn" onClick={() => handleEdit(t)} title="Edit"><Pencil size={16} /></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(t._id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No testimonials yet. Click "Add Testimonial" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card glass-card animate-fade-in">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {editingId ? <Pencil size={24} color="var(--primary)"/> : <Plus size={24} color="var(--primary)"/>}
          {editingId ? "Edit Testimonial" : "Add Testimonial"}
        </h2>
        <button onClick={() => setView('list')} className="btn btn-secondary icon-btn" style={{ padding: '8px' }}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Customer Name *</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required
              placeholder="e.g. Marc D."
            />
          </div>
          <div className="form-group">
            <label>Role / Detail</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})} 
              placeholder="e.g. Gamer, Tech Enthusiast"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Review Content *</label>
          <textarea 
            className="form-input" 
            style={{ minHeight: '120px', resize: 'vertical' }}
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})} 
            required
            placeholder="Write the review here..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Rating (1-5)</label>
            <input 
              type="number" 
              min="1" max="5" 
              className="form-input" 
              value={formData.rating} 
              onChange={e => setFormData({...formData, rating: parseInt(e.target.value, 10)})} 
            />
          </div>
          
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
              <input 
                type="checkbox" 
                checked={formData.active} 
                onChange={e => setFormData({...formData, active: e.target.checked})} 
                style={{ width: '18px', height: '18px' }}
              />
              Visible on Home Page
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setView('list')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {editingId ? "Update" : "Save"} Testimonial
          </button>
        </div>
      </form>
    </div>
  );
}

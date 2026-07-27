"use client";

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Pencil, Save, X, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false, 
  loading: () => <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-sm)' }}><Loader2 className="animate-spin" /></div>
});

export default function BlogAdmin({ products }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'edit', 'add'
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    image: '',
    seoTitle: '',
    seoDescription: '',
    relatedProducts: []
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        setArticles(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: prev.slug === generateSlug(prev.title) || prev.slug === '' ? generateSlug(val) : prev.slug
    }));
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => {
      const isSelected = prev.relatedProducts.includes(productId);
      if (isSelected) {
        return { ...prev, relatedProducts: prev.relatedProducts.filter(id => id !== productId) };
      } else {
        return { ...prev, relatedProducts: [...prev.relatedProducts, productId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = { ...formData, _id: editingId };
      
      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        await fetchArticles();
        setView('list');
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to save article.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAdd = () => {
    setFormData({ title: '', slug: '', content: '', image: '', seoTitle: '', seoDescription: '', relatedProducts: [] });
    setEditingId(null);
    setView('add');
  };

  const openEdit = (article) => {
    setFormData({ ...article });
    setEditingId(article._id);
    setView('edit');
  };

  if (loading) return (
    <div className="admin-card glass-card">
      <div className="skeleton skeleton-title" style={{ width: '250px', height: '32px' }}></div>
      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton skeleton-text" style={{ height: '40px' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '40px' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '40px', width: '60%' }}></div>
      </div>
    </div>
  );

  if (view === 'list') {
    return (
      <div className="admin-card glass-card animate-fade-in">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={24} color="var(--primary)" />
            Blog Articles ({articles.length})
          </h2>
          <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Write Article
          </button>
        </div>
        
        {articles.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No articles found. Start writing!</div>
        ) : (
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((art) => (
                  <tr key={art._id}>
                    <td style={{ fontWeight: 600 }}>{art.title}</td>
                    <td><span className="badge badge-secondary">/{art.slug}</span></td>
                    <td>{art.views || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a href={`/blog/${art.slug}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon" title="View"><LinkIcon size={16} /></a>
                        <button onClick={() => openEdit(art)} className="btn btn-secondary btn-icon" title="Edit"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(art._id)} className="btn btn-danger btn-icon" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Edit / Add Form View
  return (
    <div className="admin-card glass-card animate-fade-in">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Pencil size={24} color="var(--primary)" />
          {editingId ? 'Edit Article' : 'New Article'}
        </h2>
        <button onClick={() => setView('list')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <X size={16} /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Title <span style={{color: 'red'}}>*</span></label>
            <input type="text" value={formData.title} onChange={handleTitleChange} required placeholder="Top 10 Best Gaming Mice" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} />
          </div>
          <div className="form-group">
            <label>URL Slug <span style={{color: 'red'}}>*</span></label>
            <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required placeholder="top-10-best-gaming-mice" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} />
          </div>
        </div>

        <div className="form-group">
          <label>Cover Image URL</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flexShrink: 0, width: '42px', height: '42px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {formData.image ? <img src={formData.image} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={20} color="var(--text-muted)" />}
            </div>
            <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." style={{ flex: 1, padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} />
          </div>
        </div>

        <div className="form-group" style={{ color: 'black' }}>
          <label style={{ color: 'var(--text-primary)' }}>Content <span style={{color: 'red'}}>*</span></label>
          <div style={{ background: '#fff', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden' }}>
            <ReactQuill 
              theme="snow"
              value={formData.content} 
              onChange={(value) => setFormData({...formData, content: value})} 
              style={{ minHeight: '300px', width: '100%' }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                  ['link', 'image', 'video'],
                  ['clean']
                ],
              }}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Advanced SEO</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '12px' }}>
            <div className="form-group">
              <label>SEO Title</label>
              <input type="text" value={formData.seoTitle} onChange={(e) => setFormData({...formData, seoTitle: e.target.value})} placeholder="Leave blank to use main title" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div className="form-group">
              <label>SEO Description</label>
              <textarea value={formData.seoDescription} onChange={(e) => setFormData({...formData, seoDescription: e.target.value})} placeholder="Short description for Google Search..." style={{ minHeight: '80px', width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Link Products (Cross-selling)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Select products to display at the end of this article.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', maxHeight: '250px', overflowY: 'auto', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: 'var(--border-radius-md)' }}>
            {products.map(p => (
              <div 
                key={p._id} 
                onClick={() => handleProductToggle(p._id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer',
                  border: formData.relatedProducts.includes(p._id) ? '1px solid var(--primary)' : '1px solid transparent',
                  background: formData.relatedProducts.includes(p._id) ? 'rgba(124, 58, 237, 0.1)' : 'var(--glass-bg)',
                  borderRadius: 'var(--border-radius-sm)'
                }}
              >
                <img src={p.image} alt="" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
          <button type="button" onClick={() => setView('list')} className="btn btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
            {editingId ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Loader2, Sparkles, LogOut, FolderHeart, Mail, LayoutDashboard, ShoppingBag, ArrowLeft, Sun, Moon, ShieldAlert, Eye, Pencil, X, ExternalLink, Check, Star, Share2, Copy, Link as LinkIcon, MessageCircle, Menu, Users, FileText, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLogin from './AdminLogin';
import ContactInbox from './ContactInbox';
import ProductModal from './ProductModal';
import NewsletterAdmin from './NewsletterAdmin';
import BlogAdmin from './BlogAdmin';
import TestimonialsAdmin from './TestimonialsAdmin';
import AlertsAdmin from './AlertsAdmin';
import CommentsAdmin from './CommentsAdmin';
import CustomSelect from '@/components/CustomSelect';

export default function AdminPanel({ products, categories, subcategories = [], onRefresh, theme, toggleTheme, initialTab = 'dashboard' }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', tab === 'dashboard' ? '/admin' : `/admin/${tab}`);
    setIsSidebarOpen(false);
  };
  const [contactStats, setContactStats] = useState({ total: 0, unread: 0 });
  const [visitorStats, setVisitorStats] = useState(0);
  const [countriesData, setCountriesData] = useState({});
  const [productsView, setProductsView] = useState('list'); // 'list', 'add', 'edit'
  const [editingProductId, setEditingProductId] = useState(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [shareProduct, setShareProduct] = useState(null);
  const shareTemplateId = useMemo(() => Math.floor(Math.random() * 4), [shareProduct?._id]);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [targetEmails, setTargetEmails] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Product Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    categorySlug: '', 
    subcategorySlug: '',
    rating: '5.0',
    image: '',
    images: [], // List of all scraped image urls/paths
    affiliateUrl: '',
    featuresRaw: '',
    features: [''],
    gallery: [],
    prosRaw: '',
    consRaw: '',
    isHotDeal: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  // Scraper State
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [downloadImages, setDownloadImages] = useState(false);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeSuccess, setScrapeSuccess] = useState('');
  const [scrapeError, setScrapeError] = useState('');

  // Category Form State
  const [catFormData, setCatFormData] = useState({
    name: '',
    description: '',
    parentSlug: ''
  });

  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  
  // Notifications
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [catError, setCatError] = useState('');
  const [catSuccess, setCatSuccess] = useState('');

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) return;
      const data = await res.json();
      setVisitorStats(data.visitors || 0);
      setCountriesData(data.countries || {});
      setContactStats({
        total: data.contacts?.total || 0,
        unread: data.contacts?.unread || 0,
      });
    } catch {
      /* ignore */
    }
  };

  // Check auth status on mount
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch (err) {
      console.error("Auth check error:", err);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);

  // Set default categorySlug once categories are loaded
  useEffect(() => {
    if (categories && categories.length > 0 && !formData.categorySlug) {
      setFormData(prev => ({ ...prev, categorySlug: categories[0].slug }));
    }
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCatInputChange = (e) => {
    const { name, value } = e.target;
    setCatFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create Product
  // Create/Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const features = formData.featuresRaw.split('\n').map(item => item.trim()).filter(Boolean);
    const pros = formData.prosRaw.split('\n').map(item => item.trim()).filter(Boolean);
    const cons = formData.consRaw.split('\n').map(item => item.trim()).filter(Boolean);

    const productData = {
      ...formData,
      catalogSlug: formData.categorySlug || formData.catalogSlug || (categories && categories.length > 0 ? categories[0].slug : ''),
      price: parseFloat(formData.price.toString().replace(',', '.')),
      rating: parseFloat(formData.rating.toString().replace(',', '.')),
      features,
      pros,
      cons
    };

    try {
      const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error saving product");
      }

      setProductsView('list');
      setEditingProductId(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        categorySlug: categories[0]?.slug || '', subcategorySlug: '',
        rating: '5.0',
        image: '',
        images: [],
        affiliateUrl: '',
        featuresRaw: '',
        features: [''],
        gallery: [],
        prosRaw: '',
        consRaw: '',
        isHotDeal: false,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
      });
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price ? String(product.price) : '',
      category: product.category || '',
      categorySlug: product.categorySlug || '', subcategorySlug: product.subcategorySlug || '',
      rating: product.rating ? String(product.rating) : '5.0',
      image: product.image || '',
      images: product.images || [],
      affiliateUrl: product.affiliateUrl || '',
      features: product.features || [''],
      gallery: product.gallery || [],
      featuresRaw: Array.isArray(product.features) ? product.features.join('\n') : '',
      prosRaw: Array.isArray(product.pros) ? product.pros.join('\n') : '',
      consRaw: Array.isArray(product.cons) ? product.cons.join('\n') : '',
      isHotDeal: !!product.isHotDeal,
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      seoKeywords: product.seoKeywords || ''
    });
    setScrapeUrl('');
    setError('');
    setSuccess('');
    setScrapeSuccess('');
    setScrapeError('');
    setProductsView('edit');
  };

  const cancelForm = () => {
    setEditingProductId(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      categorySlug: categories[0]?.slug || '', subcategorySlug: '',
      rating: '5.0',
      image: '',
      images: [],
      affiliateUrl: '',
      featuresRaw: '',
      features: [''],
      gallery: [],
      prosRaw: '',
      consRaw: '',
      isHotDeal: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
    setScrapeUrl('');
    setError('');
    setSuccess('');
    setScrapeSuccess('');
    setScrapeError('');
    setProductsView('list');
  };

  const renderPreviewStars = (ratingValue) => {
    const stars = [];
    const val = parseFloat(ratingValue) || 5.0;
    const fullStars = Math.floor(val);
    const hasHalf = val % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={16} fill="currentColor" color="#fbbf24" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<Star key={i} size={16} fill="currentColor" color="#fbbf24" />);
      } else {
        stars.push(<Star key={i} size={16} color="rgba(255,255,255,0.15)" />);
      }
    }
    return stars;
  };

  const handleCopyShare = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleSendEmail = async (productUrl) => {
    if (!targetEmails.trim()) {
      alert("Please enter at least one email address.");
      return;
    }

    setEmailLoading(true);
    setEmailSuccess('');
    
    // Split by comma and clean up spaces
    const emailsList = targetEmails.split(',').map(e => e.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/email/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: shareProduct, productUrl, emails: emailsList })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email");
      
      setEmailSuccess('Emails sent successfully!');
      setTargetEmails(''); // clear input
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const renderShareModal = () => {
    if (!shareProduct) return null;
    
    const storeUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const productUrl = `${storeUrl}/product/${shareProduct._id}`;
    const desc = shareProduct.description ? shareProduct.description.substring(0, 150) + '...' : '';
    
    const templates = [
      `🌟 CHECK OUT OUR NEW OFFER! 🌟\n\n${shareProduct.title}\n\n${desc}\n\n✨ Price: $${shareProduct.price.toFixed(2)}\n\n👉 Buy it here: ${productUrl}\n\nDon't miss this opportunity! 🚀`,
      `🐾 AMAZING DEAL ALERT! 🐾\n\nTreat your pet with: ${shareProduct.title}\n\n${desc}\n\n🔥 Only $${shareProduct.price.toFixed(2)}!\n\n🛒 Grab yours now: ${productUrl}`,
      `✨ EXCLUSIVE PET PRODUCT ✨\n\n${shareProduct.title}\n\n${desc}\n\n💖 Special Price: $${shareProduct.price.toFixed(2)}\n\n👉 Discover it here: ${productUrl}`,
      `💥 TOP RATED SELECTION 💥\n\n${shareProduct.title}\n\n${desc}\n\n💰 Price: $${shareProduct.price.toFixed(2)}\n\n🛍️ Shop now: ${productUrl}`
    ];
    
    const shareText = templates[shareTemplateId % templates.length];

    return (
      <div className="preview-modal-overlay animate-fade-in" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.95)', backdropFilter: 'blur(8px)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
      }}>
        <div className="preview-modal-card glass-card animate-fade-in" style={{
          maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
          background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '16px'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem' }}>Share Product</h3>
            </div>
            <button type="button" onClick={() => { setShareProduct(null); setEmailSuccess(''); setTargetEmails(''); }} className="btn btn-secondary btn-icon">
              <X size={16} />
            </button>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
              <img src={shareProduct.image} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{shareProduct.title}</h4>
                <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 'bold' }}>${shareProduct.price.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => handleCopyLink(productUrl)}
                className="btn btn-secondary" style={{ padding: '8px 12px', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem' }}
              >
                {copiedLink ? <Check size={14} color="var(--success)"/> : <LinkIcon size={14} />}
                {copiedLink ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', background: '#25D366', color: 'white', border: 'none' }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', background: '#1877F2', color: 'white', border: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> Facebook
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareProduct.title)}&url=${encodeURIComponent(productUrl)}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', background: '#1DA1F2', color: 'white', border: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg> Twitter
              </a>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Copy Full Message</label>
              <textarea 
                readOnly
                value={shareText}
                style={{ width: '100%', height: '140px', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', resize: 'none', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: '1.5' }}
              />
              <button 
                type="button" 
                onClick={() => handleCopyShare(shareText)}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px', marginTop: '8px' }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copied to Clipboard!" : "Copy Message"}
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} /> Direct Email Sharing
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Send a beautiful HTML email of this product directly to your customers.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="emails (e.g. client@mail.com, ami@mail.com)" 
                  value={targetEmails}
                  onChange={(e) => setTargetEmails(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                />
                
                {emailSuccess ? (
                  <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={16} /> {emailSuccess}
                  </div>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => handleSendEmail(productUrl)}
                    disabled={emailLoading || !targetEmails.trim()}
                    className="btn btn-secondary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px' }}
                  >
                    {emailLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    {emailLoading ? "Sending..." : "Send Direct Email"}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderPreviewModal = () => {
    const previewFeatures = formData.featuresRaw.split('\n').map(item => item.trim()).filter(Boolean);
    const previewPros = formData.prosRaw.split('\n').map(item => item.trim()).filter(Boolean);
    const previewCons = formData.consRaw.split('\n').map(item => item.trim()).filter(Boolean);
    const categoryName = categories.find(c => c.slug === formData.categorySlug)?.name || formData.category || 'Category';
    const parsedPrice = parseFloat(formData.price) || 0.0;

    return (
      <div className="preview-modal-overlay animate-fade-in" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div className="preview-modal-card glass-card animate-fade-in" style={{
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} style={{ color: 'var(--accent-gold)' }} />
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem' }}>Live Product Page Preview</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="btn btn-secondary btn-icon"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content Body */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Split Grid */}
            <div className="admin-grid" style={{ gap: '32px' }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-card" style={{
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '12px',
                  height: '320px',
                  overflow: 'hidden'
                }}>
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.title}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }}
                    />
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>No image URL provided</span>
                  )}
                </div>

                {formData.images && formData.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {formData.images.map((img, idx) => (
                      <div key={idx} style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: formData.image === img ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                        flexShrink: 0,
                        opacity: formData.image === img ? 1 : 0.6
                      }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="glass-card" style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: 'rgba(255,255,255,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estimated Price</span>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>${parsedPrice.toFixed(2)}</span>
                  </div>

                  <a
                    href={formData.affiliateUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-buy"
                    style={{ width: '100%', textAlign: 'center', pointerEvents: 'none' }}
                  >
                    View Offer <ExternalLink size={16} style={{ marginLeft: '6px' }} />
                  </a>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '12px' }}>{categoryName}</span>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
                    {formData.title || 'Product Title Placeholder'}
                  </h1>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', color: '#fbbf24', gap: '2px' }}>
                      {renderPreviewStars(formData.rating)}
                    </div>
                    <span>{formData.rating || '5.0'} out of 5 stars</span>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
                    Expert Review & Overview
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {formData.description || 'No description provided yet.'}
                  </p>
                </div>

                {previewFeatures.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
                      Key Features
                    </h4>
                    <ul style={{ paddingLeft: '20px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {previewFeatures.map((feat, idx) => (
                        <li key={idx} style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="admin-grid" style={{ gap: '20px' }}>
                  {previewPros.length > 0 && (
                    <div className="glass-card" style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.02)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                      <h5 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 700 }}>
                        <Check size={16} /> Pros
                      </h5>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', listStyle: 'none', padding: 0, margin: 0 }}>
                        {previewPros.map((pro, idx) => (
                          <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '6px' }}>
                            <Check size={14} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {previewCons.length > 0 && (
                    <div className="glass-card" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.02)', borderColor: 'rgba(239, 68, 68, 0.15)' }}>
                      <h5 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 700 }}>
                        <ShieldAlert size={16} /> Cons
                      </h5>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', listStyle: 'none', padding: 0, margin: 0 }}>
                        {previewCons.map((con, idx) => (
                          <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '6px' }}>
                            <ShieldAlert size={14} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

  // Scraper Handler
  const handleScrape = async (e) => {
    e.preventDefault();
    if (!scrapeUrl) {
      setScrapeError("Please enter a product URL.");
      return;
    }

    setScrapeLoading(true);
    setScrapeError('');
    setScrapeSuccess('');

    try {
      const res = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl, downloadImages })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to scrape product details.");
      }

      setFormData(prev => ({
        ...prev,
        title: data.title || '',
        price: data.price ? String(data.price) : '',
        rating: data.rating ? String(data.rating) : '5.0',
        image: data.image || '',
        images: data.images || [],
        affiliateUrl: data.affiliateUrl || scrapeUrl,
        featuresRaw: Array.isArray(data.features) ? data.features.join('\n') : '',
        description: data.description || '',
        category: data.category || prev.category,
        seoTitle: data.seoTitle || prev.seoTitle,
        seoDescription: data.seoDescription || prev.seoDescription,
        seoKeywords: data.seoKeywords || prev.seoKeywords
      }));

      setScrapeSuccess("Product details imported successfully! Review and finalize the fields in the form below.");
    } catch (err) {
      setScrapeError(err.message);
    } finally {
      setScrapeLoading(false);
    }
  };

  // Create Category
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    setCatLoading(true);
    setCatError('');
    setCatSuccess('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catFormData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error creating category");
      }

      setCatSuccess("Category created successfully!");
      setCatFormData({ name: '', description: '', parentSlug: '' });
      onRefresh();
    } catch (err) {
      setCatError(err.message);
    } finally {
      setCatLoading(false);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error deleting product");
      }

      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Category
  const handleCatDelete = async (id, name) => {
    if (!confirm(`WARNING: Deleting the category "${name}" will also delete ALL products associated with it. Confirm deletion?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error deleting category");
      }

      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // 1. Checking Session
  if (isAuthenticated === null) {
    return (
      <div className="admin-loading container">
        <Loader2 className="animate-spin" size={48} />
        <p>Checking session...</p>
        <style jsx>{`
          .admin-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            gap: 16px;
            color: var(--text-secondary);
          }
          .animate-spin {
            animation: spin 1.2s linear infinite;
            color: var(--primary);
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 2. Login Gate
  if (isAuthenticated === false) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'products': return 'Products Management';
      case 'categories': return 'Categories Management';
      case 'visitors': return 'Visitors Analytics';
      case 'contact': return 'Contact Inbox';
      case 'alerts': return 'Price Alerts';
      case 'comments': return 'Comments Moderation';
      default: return 'Administration Console';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-overview-tab animate-fade-in">
            <div className="welcome-banner glass-card">
              <div className="welcome-content">
                <h2>Welcome back, Admin! 👋</h2>
                <p>Here is what's happening with BahijaPets today. You can manage products, categories, and read contact messages from users.</p>
              </div>
              <div className="welcome-decor">
                <Sparkles size={48} className="sparkle-decor" />
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card glass-card">
                <div className="stat-icon-wrapper p-bg">
                  <Eye size={22} />
                </div>
                <div className="stat-data">
                  <span className="stat-value">{visitorStats}</span>
                  <span className="stat-label">Total Visitors</span>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon-wrapper m-bg">
                  <Mail size={22} />
                </div>
                <div className="stat-data">
                  <span className="stat-value">{contactStats.unread}</span>
                  <span className="stat-label">Unread Messages</span>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
                  <MessageCircle size={22} />
                </div>
                <div className="stat-data">
                  <span className="stat-value">{contactStats.total}</span>
                  <span className="stat-label">Total Messages</span>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon-wrapper p-bg">
                  <ShoppingBag size={22} />
                </div>
                <div className="stat-data">
                  <span className="stat-value">{products.length}</span>
                  <span className="stat-label">Total Products</span>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon-wrapper c-bg">
                  <FolderHeart size={22} />
                </div>
                <div className="stat-data">
                  <span className="stat-value">{categories.length}</span>
                  <span className="stat-label">Active Categories</span>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon-wrapper h-bg">
                  <Sparkles size={22} />
                </div>
                <div className="stat-data">
                  <span className="stat-value">{products.filter(p => p.isHotDeal).length}</span>
                  <span className="stat-label">Hot Deals Listed</span>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card glass-card">
                <h4>Quick Actions</h4>
                <div className="quick-actions-list">
                  <button type="button" onClick={() => handleTabChange('products')} className="quick-btn btn btn-primary">
                    <Plus size={16} /> Add Product
                  </button>
                  <button type="button" onClick={() => handleTabChange('categories')} className="quick-btn btn btn-secondary">
                    <Plus size={16} /> Create Category
                  </button>
                  <button type="button" onClick={() => handleTabChange('contact')} className="quick-btn btn btn-secondary">
                    <Mail size={16} /> Read Inbox
                  </button>
                </div>
              </div>
              <div className="dashboard-card glass-card">
                <h4>System Information</h4>
                <div className="sys-info-list">
                  <div className="sys-info-item">
                    <span className="info-key">Database Status:</span>
                    <span className="info-val status-online">Connected</span>
                  </div>
                  <div className="sys-info-item">
                    <span className="info-key">Categories List:</span>
                    <span className="info-val" style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {categories.map(c => c.name).join(', ') || 'None'}
                    </span>
                  </div>
                  <div className="sys-info-item">
                    <span className="info-key">Total Estimated Price Value:</span>
                    <span className="info-val">${products.reduce((acc, p) => acc + (p.price || 0), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'visitors':
        const sortedCountries = Object.entries(countriesData).sort((a, b) => b[1] - a[1]);
        
        return (
          <div className="admin-grid visitors-tab animate-fade-in" style={{ gap: '32px' }}>
            {/* Left Column: Summary */}
            <div className="admin-card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                <Eye className="header-icon" size={18} />
                <h3>Traffic Overview</h3>
              </div>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                  {visitorStats}
                </div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '12px', fontWeight: 600 }}>
                  Total Unique Visitors
                </div>
              </div>
            </div>

            {/* Right Column: Countries List */}
            <div className="admin-card glass-card">
              <div className="card-header" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', marginBottom: '24px' }}>
                <Users className="header-icon" size={18} />
                <h3>Top Countries</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {sortedCountries.length > 0 ? (
                  sortedCountries.map(([country, count]) => {
                    const percentage = Math.round((count / Math.max(visitorStats, 1)) * 100);
                    return (
                      <div key={country} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{country}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{count} ({percentage}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #818cf8)', borderRadius: '4px' }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
                    No country data available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'products':
        if (productsView === 'list') {
          const filteredProducts = products.filter(p => {
            const searchLower = productSearchQuery.toLowerCase();
            const categoryName = categories.find(c => c.slug === p.categorySlug)?.name || p.categorySlug || '';
            return p.title.toLowerCase().includes(searchLower) || 
                   categoryName.toLowerCase().includes(searchLower) || 
                   (p.category && p.category.toLowerCase().includes(searchLower));
          });

          return (
            <div className="products-list-view-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="products-list-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div className="search-bar-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Search by product name, category, or category..."
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      categorySlug: categories[0]?.slug || ''
                    }));
                    setProductsView('add');
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={18} /> Add Product
                </button>
              </div>

              <div className="admin-card glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
                <div className="card-header" style={{ padding: '24px 30px', marginBottom: '0px' }}>
                  <h3>Existing Products ({filteredProducts.length})</h3>
                </div>
                <div className="table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Views</th>
                        <th>Clicks</th>
                        <th>Conv. Rate</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, index) => (
                        <tr key={product._id}>
                          <td><strong style={{ color: 'var(--text-muted)' }}>{index + 1}</strong></td>
                          <td>
                            <div className="table-product-info">
                              <img src={product.image} alt="" className="table-thumb" />
                              <span className="table-title" title={product.title}>{product.title}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-primary">
                              {categories.find(c => c.slug === (product.catalogSlug || product.categorySlug))?.name || 
                               subcategories.find(s => s.slug === (product.catalogSlug || product.categorySlug))?.name || 
                               product.catalogSlug || product.categorySlug}
                            </span>
                          </td>
                          <td><strong>${product.price.toFixed(2)}</strong></td>
                          <td>{product.views || 0}</td>
                          <td>{product.clicks || 0}</td>
                          <td>
                            {product.views > 0 
                              ? `${(((product.clicks || 0) / product.views) * 100).toFixed(1)}%` 
                              : '0.0%'}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => { setShareProduct(product); setCopied(false); }}
                                className="btn btn-secondary btn-icon"
                                title="Share Product"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}
                              >
                                <Share2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewProduct(product)}
                                className="btn btn-secondary btn-icon"
                                title="Quick Preview"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => startEditProduct(product)}
                                className="btn btn-secondary btn-icon"
                                title="Edit Product"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(product._id)}
                                className="btn btn-danger btn-icon"
                                title="Delete Product"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan="4" className="empty-table" style={{ padding: '40px' }}>
                            {productSearchQuery ? "No products match your search query." : "No products found."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="product-form-view-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Custom Header with Actions */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                borderBottom: '1px solid var(--glass-border)', 
                paddingBottom: '20px', 
                marginBottom: '10px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="btn btn-secondary btn-icon"
                    title="Back to List"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                      Products / {editingProductId ? 'Edit' : 'Create'}
                    </span>
                    <h2 style={{ margin: '4px 0 0 0', fontWeight: '800', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                      {editingProductId ? `Edit Product: ${formData.title.substring(0, 35)}${formData.title.length > 35 ? '...' : ''}` : 'Add New Product'}
                    </h2>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    <Eye size={18} /> Preview Page
                  </button>
                  <button
                    type="submit"
                    form="product-form"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    {editingProductId ? 'Save Product' : 'Add Product'}
                  </button>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="admin-grid" style={{ gap: '32px', alignItems: 'start' }}>
                
                {/* Left Column - Main Content & Reviews */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* Form Component Wrapper */}
                  <form id="product-form" onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      
                      {error && <div className="alert alert-error">{error}</div>}
                      {success && <div className="alert alert-success">{success}</div>}

                      {/* Card 1: Main Details */}
                      <div className="admin-card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="card-header" style={{ marginBottom: '0px', paddingBottom: '12px' }}>
                          <ShoppingBag className="header-icon" size={18} />
                          <h3>Main Information</h3>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Product Title *</label>
                          <input
                            type="text" name="title" required
                            value={formData.title} onChange={handleInputChange}
                            className="form-input" placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Image URL *</label>
                          <input
                            type="url" name="image" required
                            value={formData.image} onChange={handleInputChange}
                            className="form-input" placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Product Description</label>
                          <textarea
                            name="description"
                            value={formData.description} onChange={handleInputChange}
                            className="form-textarea" placeholder="Enter a detailed description..."
                            style={{ minHeight: '160px' }}
                          />
                        </div>
                      </div>

                      {/* Card 2: Scraped Gallery (if images exist) */}
                      {formData.images && formData.images.length > 0 && (
                        <div className="admin-card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className="card-header" style={{ marginBottom: '0px', paddingBottom: '12px' }}>
                            <Eye className="header-icon" size={18} style={{ color: 'var(--accent-gold)' }} />
                            <h3>Media Gallery ({formData.images.length})</h3>
                          </div>
                          
                          <div className="gallery-thumbs" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '4px 0 10px 0' }}>
                            {formData.images.map((img, idx) => (
                              <div 
                                key={idx} 
                                className={`gallery-thumb-wrapper ${formData.image === img ? 'active' : ''}`} 
                                onClick={() => setFormData(prev => ({ ...prev, image: img }))}
                                style={{ width: '64px', height: '64px' }}
                              >
                                <img src={img} alt="" className="gallery-thumb-img" />
                                {formData.image === img && <span className="main-badge" style={{ fontSize: '0.5rem', padding: '2px 0' }}>Main</span>}
                              </div>
                            ))}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            💡 Click a thumbnail above to set it as the primary cover image on the website.
                          </span>
                        </div>
                      )}

                      {/* Card 3: Expert Review details */}
                      <div className="admin-card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="card-header" style={{ marginBottom: '0px', paddingBottom: '12px' }}>
                          <Sparkles className="header-icon" size={18} />
                          <h3>Expert Review & Features</h3>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Key Features (One per line)</label>
                          <textarea
                            name="featuresRaw"
                            value={formData.featuresRaw} onChange={handleInputChange}
                            className="form-textarea short-textarea" placeholder="e.g. 30-hour battery life&#10;Active Noise Cancellation&#10;Bluetooth 5.2 support"
                            style={{ minHeight: '100px' }}
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label pros-label">Pros (Optional, one per line)</label>
                            <textarea
                              name="prosRaw"
                              value={formData.prosRaw} onChange={handleInputChange}
                              className="form-textarea short-textarea" placeholder="e.g. Comfortable earcups&#10;Excellent soundstage"
                              style={{ minHeight: '120px' }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label cons-label">Cons (Optional, one per line)</label>
                            <textarea
                              name="consRaw"
                              value={formData.consRaw} onChange={handleInputChange}
                              className="form-textarea short-textarea" placeholder="e.g. High retail price&#10;Charging cable is short"
                              style={{ minHeight: '120px' }}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </form>

                  {/* Form Footer Controls */}
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="btn btn-secondary"
                      style={{ padding: '12px 30px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="product-form"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 36px' }}
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                      {editingProductId ? 'Save Product' : 'Add Product'}
                    </button>
                  </div>

                </div>

                {/* Right Column - Side Panels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* Side Card 1: Product Import */}
                  <div className="admin-card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card-header" style={{ marginBottom: '0px', paddingBottom: '12px' }}>
                      <Sparkles className="header-icon" size={18} style={{ color: 'var(--accent-gold)' }} />
                      <h3>Import Product</h3>
                    </div>

                    <div className="scraper-container" style={{ borderStyle: 'solid', margin: '0px', background: 'rgba(255,255,255,0.01)', padding: '14px' }}>
                      <p className="scraper-desc" style={{ marginBottom: '14px', fontSize: '0.8rem' }}>
                        Paste any supported product URL to immediately import the product title, features, cover, description, and related gallery images.
                      </p>

                      {scrapeError && <div className="alert alert-error" style={{ marginBottom: '14px', padding: '8px 12px', fontSize: '0.8rem' }}>{scrapeError}</div>}
                      {scrapeSuccess && <div className="alert alert-success" style={{ marginBottom: '14px', padding: '8px 12px', fontSize: '0.8rem' }}>{scrapeSuccess}</div>}

                      <div className="scraper-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                        <input
                          type="url"
                          value={scrapeUrl}
                          onChange={(e) => setScrapeUrl(e.target.value)}
                          placeholder="Product link (https://...)"
                          className="form-input scraper-url-input"
                          style={{ width: '100%' }}
                        />
                        <button
                          type="button"
                          onClick={handleScrape}
                          disabled={scrapeLoading}
                          className="btn btn-secondary scraper-btn"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {scrapeLoading ? <Loader2 className="animate-spin" size={16} /> : "Fetch Product Details"}
                        </button>
                      </div>

                      <div className="form-checkbox scraper-checkbox" style={{ margin: 0 }}>
                        <input
                          type="checkbox"
                          id="downloadImages"
                          checked={downloadImages}
                          onChange={(e) => setDownloadImages(e.target.checked)}
                        />
                        <label htmlFor="downloadImages" style={{ fontSize: '0.8rem' }}>Download images locally</label>
                      </div>
                    </div>
                  </div>

                  {/* Side Card 2: Pricing & Affiliate */}
                  <div className="admin-card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card-header" style={{ marginBottom: '0px', paddingBottom: '12px' }}>
                      <FolderHeart className="header-icon" size={18} />
                      <h3>Pricing & Link</h3>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Price ($) *</label>
                      <input
                        type="number" name="price" step="0.01" required
                        value={formData.price} onChange={handleInputChange}
                        className="form-input" placeholder="e.g. 79.99"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Product Affiliate Link *</label>
                      <input
                        type="url" name="affiliateUrl" required
                        value={formData.affiliateUrl} onChange={handleInputChange}
                        className="form-input" placeholder="https://amzn.to/..."
                      />
                    </div>
                  </div>

                  {/* Side Card 3: Categorization & Status */}
                  <div className="admin-card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card-header" style={{ marginBottom: '0px', paddingBottom: '12px' }}>
                      <FolderHeart className="header-icon" size={18} />
                      <h3>Categorization</h3>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Destination Category *</label>
                      {categories.length === 0 ? (
                        <div className="form-select" style={{ color: 'var(--text-muted)' }}>
                          Please create a category first...
                        </div>
                      ) : (
                        <CustomSelect
                          value={formData.categorySlug || categories[0]?.slug}
                          onChange={(val) => handleInputChange({ target: { name: 'categorySlug', value: val }})}
                          options={(() => {
                            const opts = [];
                            categories.forEach(parent => {
                              opts.push({ value: parent.slug, label: parent.name });
                              subcategories.filter(s => s.parentSlug === parent.slug).forEach(sub => {
                                opts.push({ value: sub.slug, label: `  ↳ ${sub.name}` });
                              });
                            });
                            // Add any orphans that might exist
                            subcategories.filter(s => !categories.find(p => p.slug === s.parentSlug)).forEach(orphan => {
                              opts.push({ value: orphan.slug, label: orphan.name });
                            });
                            return opts;
                          })()}
                        />
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sub-category (Optional)</label>
                      <input
                        type="text" name="category"
                        value={formData.category} onChange={handleInputChange}
                        className="form-input" placeholder="e.g. Keyboards, Audio"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Rating (out of 5) *</label>
                      <input
                        type="number" name="rating" step="0.1" min="1" max="5" required
                        value={formData.rating} onChange={handleInputChange}
                        className="form-input" placeholder="4.8"
                      />
                    </div>

                    <div className="form-section" style={{ marginTop: '32px' }}>
                      <h4 style={{ marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', color: 'var(--primary)' }}>Advanced SEO (Optional)</h4>
                      
                      <div className="form-group">
                        <label className="form-label">SEO Title (Overrides main title in Google)</label>
                        <input
                          type="text" name="seoTitle"
                          value={formData.seoTitle} onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g., Buy the Best X Online - BahijaPets"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">SEO Description (Meta Description)</label>
                        <textarea
                          name="seoDescription"
                          value={formData.seoDescription} onChange={handleInputChange}
                          className="form-input"
                          rows="2"
                          placeholder="Short summary to appear under the Google search link..."
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">SEO Keywords</label>
                        <input
                          type="text" name="seoKeywords"
                          value={formData.seoKeywords} onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g., tech, gadgets, cheap iphone"
                        />
                      </div>
                    </div>

                    <div className="form-checkbox" style={{ marginTop: '4px' }}>
                      <input
                        type="checkbox" name="isHotDeal" id="isHotDeal"
                        checked={formData.isHotDeal} onChange={handleInputChange}
                      />
                      <label htmlFor="isHotDeal" style={{ fontWeight: 600 }}>Highlight as "Special Offer"</label>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        }
      case 'categories':
        return (
          <div className="admin-grid categories-tab animate-fade-in">
            {/* Left Column: Create Category Form */}
            <div className="admin-card glass-card">
              <div className="card-header">
                <FolderHeart className="header-icon" size={18} />
                <h3>Category Management</h3>
              </div>
              
              <form onSubmit={handleCatSubmit} className="admin-form">
                {catError && <div className="alert alert-error">{catError}</div>}
                {catSuccess && <div className="alert alert-success">{catSuccess}</div>}

                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input 
                    type="text" name="name" required 
                    value={catFormData.name} onChange={handleCatInputChange}
                    className="form-input" placeholder="e.g. Beauty & Wellness"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input 
                    type="text" name="description" 
                    value={catFormData.description} onChange={handleCatInputChange}
                    className="form-input" placeholder="A short presentation sentence"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Category (Optional)</label>
                  <select
                    name="parentSlug"
                    value={catFormData.parentSlug}
                    onChange={handleCatInputChange}
                    className="form-input"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">None (Main Category)</option>
                    {categories.map(parentCat => (
                      <option key={parentCat.slug} value={parentCat.slug}>{parentCat.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" disabled={catLoading} className="btn btn-primary submit-btn">
                  {catLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Create Category
                </button>
              </form>
            </div>

            {/* Right Column: Existing Categories List */}
            <div className="admin-card glass-card">
              <div className="card-header">
                <h3>Existing Categories ({categories.length} / Subs: {subcategories.length})</h3>
              </div>
              <div className="category-table-container" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0, maxHeight: 'none' }}>
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategories.map((cat, index) => (
                      <tr key={cat._id}>
                        <td><strong style={{ color: 'var(--text-muted)' }}>{index + 1}</strong></td>
                        <td>
                          <div className="category-table-info">
                            <strong>{cat.name}</strong>
                            <span className="category-table-slug">/{cat.slug}</span>
                            {cat.parentSlug && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', display: 'block' }}>
                                ↳ {categories.find(c => c.slug === cat.parentSlug)?.name || cat.parentSlug}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <button 
                            type="button"
                            onClick={() => handleCatDelete(cat.slug, cat.name)}
                            className="btn btn-danger btn-icon"
                            title="Delete category and all its products"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return <ContactInbox onStatsChange={setContactStats} />;
      case 'newsletter':
        return <NewsletterAdmin />;
      case 'blog':
        return <BlogAdmin products={products} />;
      case 'testimonials':
        return <TestimonialsAdmin />;
      case 'alerts':
        return <AlertsAdmin />;
      case 'comments':
        return <CommentsAdmin />;
      default:
        return null;
    }
  };

  // 3. Admin Dashboard
  return (
    <div className="admin-dashboard-layout animate-fade-in">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <img src="/bahijapetlogo.png" alt="Logo" className="brand-icon" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div>
            <span className="brand-name">BahijaPets Admin</span>
            <span className="brand-badge">Console</span>
          </div>
          <button 
            type="button" 
            className="mobile-close-btn" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <button 
            type="button"
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          
          <button 
            type="button"
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => handleTabChange('products')}
          >
            <ShoppingBag size={18} />
            <span>Products</span>
          </button>

          <button 
            type="button"
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => handleTabChange('categories')}
          >
            <FolderHeart size={18} />
            <span>Categories</span>
          </button>
          
          <button 
            type="button"
            className={`nav-item ${activeTab === 'visitors' ? 'active' : ''}`}
            onClick={() => handleTabChange('visitors')}
          >
            <Users size={18} />
            <span>Visitors</span>
          </button>

          <button 
            type="button"
            className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => handleTabChange('contact')}
          >
            <Mail size={18} />
            <span>Messages</span>
            {contactStats.unread > 0 && (
              <span className="unread-badge-count">{contactStats.unread}</span>
            )}
          </button>

          <button 
            type="button"
            className={`nav-item ${activeTab === 'newsletter' ? 'active' : ''}`}
            onClick={() => handleTabChange('newsletter')}
          >
            <MessageCircle size={18} />
            <span>Newsletter</span>
          </button>

          <button 
            type="button"
            className={`nav-item ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => handleTabChange('blog')}
          >
            <FileText size={18} />
            <span>Articles / Blog</span>
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => handleTabChange('testimonials')}
          >
            <Star size={18} />
            <span>Testimonials</span>
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => handleTabChange('alerts')}
          >
            <Bell size={18} />
            <span>Price Alerts</span>
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => handleTabChange('comments')}
          >
            <MessageCircle size={18} />
            <span>Comments</span>
          </button>

          <div className="nav-divider"></div>
          
          <Link href="/" className="nav-item back-link-btn" style={{ marginTop: 'auto' }}>
            <ArrowLeft size={18} />
            <span>Back to Shop</span>
          </Link>
        </nav>

        {/* User Info & Logout at bottom */}
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <span>A</span>
          </div>
          <div className="profile-details">
            <span className="profile-name">Administrator</span>
            <span className="profile-role">Super Admin</span>
          </div>
          <button type="button" onClick={handleLogout} className="logout-btn-icon" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main-viewport">
        {/* Header */}
        <header className="admin-topbar">
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              type="button" 
              className="mobile-menu-btn" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="topbar-title">{getTabTitle()}</h1>
          </div>
          <div className="topbar-right">
            <button type="button" onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="topbar-user-badge">
              <div className="status-indicator"></div>
              <span>System Online</span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="admin-content-viewport">
          {renderTabContent()}
        </main>
      </div>
      {/* Preview Modal */}
      {isPreviewOpen && renderPreviewModal()}
      {/* Share Modal */}
      {shareProduct && renderShareModal()}
      
      {/* Quick Preview Modal */}
      {previewProduct && (
        <ProductModal 
          product={previewProduct} 
          onClose={() => setPreviewProduct(null)} 
        />
      )}
    </div>
  );
}

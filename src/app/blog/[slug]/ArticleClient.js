"use client";

import { ArrowLeft, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CommentsSection from '@/components/CommentsSection';
import { useTheme } from '@/hooks/useTheme';

export default function ArticleClient({ article, relatedProducts }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Basic markdown to HTML converter for simple formatting
  const parseContent = (content) => {
    if (!content) return { __html: '' };
    
    // Check if it already contains HTML tags like <p>, <h2>, etc.
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return { __html: content };
    }

    // Otherwise, do basic markdown-like parsing
    let html = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' style='color: var(--primary); text-decoration: underline'>$1</a>");
    
    // Wrap paragraphs
    html = html.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');

    return { __html: html };
  };

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar theme={theme} toggleTheme={toggleTheme} hideSearch={true} />
        <main className="container" style={{ flex: 1, padding: '120px 20px', textAlign: 'center' }}>
          <h2>Article Not Found</h2>
          <Link href="/blog" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="bg-glow-container"><div className="bg-glow-1"></div><div className="bg-glow-2"></div></div>
      
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main className="container" style={{ flex: 1, padding: '100px 20px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '32px', textDecoration: 'none', fontWeight: 500 }}>
          <ArrowLeft size={18} /> Back to all articles
        </Link>
        
        <article className="glass-card" style={{ padding: '40px', borderRadius: 'var(--border-radius-lg)' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2, color: 'var(--text-primary)' }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} /> {new Date(article.createdAt).toLocaleDateString()}
              </span>
            </div>
          </header>

          {article.image && (
            <div style={{ width: '100%', height: 'auto', maxHeight: '450px', marginBottom: '40px', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
              <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div 
            className="article-content"
            style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}
            dangerouslySetInnerHTML={parseContent(article.content)} 
          />
        </article>

        {relatedProducts && relatedProducts.length > 0 && (
          <section style={{ marginTop: '60px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>Featured Products in this Guide</h2>
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {relatedProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onSelect={(p) => router.push(`/product/${p._id}`)} 
                />
              ))}
            </div>
          </section>
        )}

        <CommentsSection 
          entityId={article._id} 
          entityType="article" 
          entityTitle={article.title} 
        />
      </main>
      
      <Footer />
    </div>
  );
}

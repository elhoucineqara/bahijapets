"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';
import AdsterraAd from '@/components/AdsterraAd';
import styles from './blog.module.css';

export default function BlogClient({ articles }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.blogPage}>
      <div className="bg-glow-container">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>
      
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main className={`container ${styles.mainContent}`}>
        <header className={`${styles.header} animate-fade-in stagger-1`}>
          <h1 className={styles.title}>Pet Care Guides & Expert Advice</h1>
          <p className={styles.subtitle}>
            Discover tips, training tricks, and in-depth product reviews to give your furry friends the best life possible.
          </p>
        </header>

        {articles.length === 0 ? (
          <div className={`glass-card ${styles.emptyState}`}>
            <p>No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '40px' }}>
              <AdsterraAd adKey="2343f85537b9c5540c84d1d0e8892ebc" width={300} height={250} />
            </div>
            <div className={styles.masonryGrid}>
            {articles.map((article, index) => (
              <Link 
                href={`/blog/${article.slug}`} 
                key={article._id} 
                className={`${styles.articleLink} animate-fade-in stagger-${(index % 4) + 1}`}
              >
                <div className={`${styles.articleCard} glass-card`}>
                  <div className={styles.imageContainer}>
                    {article.image ? (
                      <img src={article.image} alt={article.title} className={styles.articleImage} loading="lazy" />
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.date}>
                      {new Date(article.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <h2 className={styles.articleTitle}>{article.title}</h2>
                    <p className={styles.articleExcerpt}>
                      {article.seoDescription || article.content.substring(0, 120) + '...'}
                    </p>
                    <span className={styles.readMore}>
                      Read Article <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

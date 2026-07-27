"use client";

import { X, Check, AlertTriangle, ExternalLink, Star } from 'lucide-react';
import styles from './ProductModal.module.css';

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const { title, description, price, category, rating, image, affiliateUrl, features, pros, cons } = product;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} glass-card animate-fade-in`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.modalGrid}>
          <div className={styles.modalLeft}>
            <div className={styles.modalImageContainer}>
              <img src={image} alt={title} className={styles.modalImage} />
            </div>

            <div className={styles.modalPricingBox}>
              <div className={styles.modalPriceInfo}>
                <span className={styles.priceTitle}>Estimated Price</span>
                <span className={styles.priceTag}>${price.toFixed(2)}</span>
              </div>
              <a 
                href={product.affiliateUrl} 
                target="_blank" 
                rel="noreferrer" 
                className={`btn btn-buy ${styles.btnLarge}`}
              >
                View Offer <ExternalLink size={18} />
              </a>
              <span className={styles.affiliateNote}>
                * Estimated price, may vary on the partner store. Affiliate link.
              </span>
            </div>
          </div>

          <div className={styles.modalRight}>
            <span className={`${styles.modalCategory} badge badge-primary`}>{category}</span>
            <h2 className={styles.modalTitle}>{title}</h2>

            <div className={styles.modalRating}>
              <Star size={16} fill="currentColor" />
              <span className={styles.ratingText}>{rating} / 5</span>
            </div>

            <div className={styles.modalSection}>
              <h4 className={styles.sectionTitle}>Product Overview</h4>
              <p className={styles.modalDescription}>{description}</p>
            </div>

            {features && features.length > 0 && (
              <div className={styles.modalSection}>
                <h4 className={styles.sectionTitle}>Key Features</h4>
                <ul className={styles.featuresList}>
                  {features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.prosConsGrid}>
              {pros && pros.length > 0 && (
                <div>
                  <h4 className={`${styles.sectionTitle} ${styles.prosTitle}`}>Pros</h4>
                  <ul className={styles.feedbackList}>
                    {pros.map((pro, idx) => (
                      <li key={idx} className={styles.proItem}>
                        <Check size={16} className={styles.proIcon} />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {cons && cons.length > 0 && (
                <div>
                  <h4 className={`${styles.sectionTitle} ${styles.consTitle}`}>Cons</h4>
                  <ul className={styles.feedbackList}>
                    {cons.map((con, idx) => (
                      <li key={idx} className={styles.conItem}>
                        <AlertTriangle size={16} className={styles.conIcon} />
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
  );
}

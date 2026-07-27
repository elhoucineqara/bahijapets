"use client";

import { Star, ExternalLink, Flame } from 'lucide-react';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onSelect }) {
  const { title, price, category, rating, image, affiliateUrl, isHotDeal } = product;

  const renderStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalf = ratingValue % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<Star key={i} size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />);
      } else {
        stars.push(<Star key={i} size={14} className={styles.starEmpty} />);
      }
    }
    return stars;
  };

  return (
    <div className={`${styles.productCard} glass-card animate-fade-in`}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.productImage} loading="lazy" />
        <span className={`${styles.categoryBadge} badge badge-primary`}>{category}</span>
        {isHotDeal && (
          <span className={`${styles.hotBadge} badge`}>
            <Flame size={12} style={{ marginRight: '4px' }} />
            Special Offer
          </span>
        )}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.productTitle}>{title}</h3>

        <div className={styles.ratingContainer}>
          <div>{renderStars(rating)}</div>
          <span className={styles.ratingValue}>{rating} / 5</span>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.priceContainer}>
            <span className={styles.priceLabel}>Estimated Price</span>
            <span className={styles.priceValue}>${price.toFixed(2)}</span>
          </div>

          <div className={styles.cardActions}>
            <button className={`btn btn-secondary ${styles.btnSm}`} onClick={() => onSelect(product)}>
              Details
            </button>
            <a 
              href={product.affiliateUrl} 
              target="_blank" 
              rel="noreferrer" 
              className={`btn btn-buy ${styles.btnSm}`}
              onClick={(e) => e.stopPropagation()}
            >
              View Offer <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

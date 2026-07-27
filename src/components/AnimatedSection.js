"use client";

import { useEffect, useRef, useState } from 'react';

export default function AnimatedSection({ children, className = '', staggerIndex = 1, threshold = 0.1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: threshold }
    );
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, [threshold]);

  return (
    <div
      ref={domRef}
      className={`${className} ${isVisible ? 'animate-fade-in' : ''}`}
      style={{ opacity: isVisible ? undefined : 0, animationDelay: `${staggerIndex * 0.15}s` }}
    >
      {children}
    </div>
  );
}

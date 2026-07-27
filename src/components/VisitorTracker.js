"use client";

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    if (!sessionStorage.getItem('visited')) {
      // First, try to get country
      fetch('https://api.country.is/')
        .then(res => res.json())
        .then(data => {
          const countryCode = data.country || 'Unknown';
          sendVisit(countryCode);
        })
        .catch(() => {
          // Fallback if country API fails
          sendVisit('Unknown');
        });
    }

    function sendVisit(country) {
      fetch('/api/stats', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country })
      })
      .then(res => {
        if (res.ok) {
          sessionStorage.setItem('visited', 'true');
        }
      })
      .catch(err => console.error('Failed to track visit', err));
    }
  }, []);

  return null;
}

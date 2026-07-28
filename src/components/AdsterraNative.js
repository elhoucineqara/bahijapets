"use client";

import React, { useEffect, useRef } from 'react';

export default function AdsterraNative() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Only run once
    if (document.getElementById('adsterra-native-script')) return;

    const script = document.createElement('script');
    script.id = 'adsterra-native-script';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl30581879.effectivecpmnetwork.com/a0aa0ae546c1bf20ae632c36a2b1ddb5/invoke.js';
    
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed, though usually better to leave the script loaded
    };
  }, []);

  return (
    <div style={{ margin: '20px auto', display: 'flex', justifyContent: 'center' }}>
      <div id="container-a0aa0ae546c1bf20ae632c36a2b1ddb5" ref={containerRef}></div>
    </div>
  );
}

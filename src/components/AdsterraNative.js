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
    script.src = 'https://pl30582059.effectivecpmnetwork.com/2452e52871f51178d2b1da848bc4f77b/invoke.js';
    
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed, though usually better to leave the script loaded
    };
  }, []);

  return (
    <div style={{ margin: '20px auto', display: 'flex', justifyContent: 'center' }}>
      <div id="container-2452e52871f51178d2b1da848bc4f77b" ref={containerRef}></div>
    </div>
  );
}

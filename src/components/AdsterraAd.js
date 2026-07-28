"use client";

import React from 'react';

export default function AdsterraAd({ adKey, width, height }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px auto', width: '100%', overflow: 'hidden' }}>
      <iframe
        src={`/adsterra.html?key=${adKey}&width=${width}&height=${height}`}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        style={{ border: 'none', overflow: 'hidden' }}
        title="Advertisement"
      />
    </div>
  );
}

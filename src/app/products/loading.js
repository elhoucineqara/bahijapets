export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container" style={{ flex: 1, padding: '120px 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="skeleton skeleton-title" style={{ width: '40%', height: '2.5rem', marginBottom: '16px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '30%', height: '1.2rem' }}></div>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', flexDirection: 'row' }}>
          {/* Sidebar Skeleton (hidden on mobile, assumed visible on desktop for loading) */}
          <div className="skeleton" style={{ width: '280px', height: '600px', borderRadius: '16px', flexShrink: 0, display: 'none' }} />
          
          {/* Grid */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

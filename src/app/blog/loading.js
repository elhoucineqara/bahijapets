export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container" style={{ flex: 1, padding: '120px 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="skeleton skeleton-title" style={{ width: '40%', height: '3rem', marginBottom: '16px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '30%', height: '1.2rem', marginBottom: '40px' }}></div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="skeleton skeleton-card" style={{ height: '350px' }}></div>
          <div className="skeleton skeleton-card" style={{ height: '350px' }}></div>
          <div className="skeleton skeleton-card" style={{ height: '350px' }}></div>
        </div>
      </main>
    </div>
  );
}

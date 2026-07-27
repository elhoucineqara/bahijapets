export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <main className="container" style={{ flex: 1, padding: '120px 20px 60px' }}>
        {/* Hero Skeleton */}
        <div style={{ textAlign: 'center', marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="skeleton skeleton-title" style={{ width: '60%', height: '3.5rem', marginBottom: '20px', maxWidth: '800px' }}></div>
          <div className="skeleton skeleton-title" style={{ width: '40%', height: '3.5rem', marginBottom: '24px', maxWidth: '600px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '50%', height: '1.2rem', marginBottom: '40px', maxWidth: '500px' }}></div>
          <div className="skeleton" style={{ width: '200px', height: '56px', borderRadius: '28px' }}></div>
        </div>
        
        {/* Products Grid Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
        </div>
      </main>
    </div>
  );
}

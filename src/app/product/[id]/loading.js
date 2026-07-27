export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container" style={{ flex: 1, padding: '120px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
          {/* Image */}
          <div className="skeleton" style={{ height: '500px', borderRadius: '24px', width: '100%' }}></div>
          
          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '20px' }}>
            <div className="skeleton skeleton-text" style={{ width: '30%', height: '1rem', marginBottom: '16px' }}></div>
            <div className="skeleton skeleton-title" style={{ width: '90%', height: '2.5rem', marginBottom: '12px' }}></div>
            <div className="skeleton skeleton-title" style={{ width: '60%', height: '2.5rem', marginBottom: '24px' }}></div>
            
            <div className="skeleton" style={{ width: '25%', height: '2.5rem', marginBottom: '32px', borderRadius: '8px' }}></div>
            
            <div className="skeleton skeleton-text" style={{ height: '1rem', marginBottom: '12px' }}></div>
            <div className="skeleton skeleton-text" style={{ height: '1rem', marginBottom: '12px' }}></div>
            <div className="skeleton skeleton-text" style={{ height: '1rem', marginBottom: '32px', width: '80%' }}></div>
            
            <div className="skeleton" style={{ width: '100%', height: '64px', borderRadius: '32px', marginBottom: '16px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '64px', borderRadius: '32px' }}></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container" style={{ flex: 1, padding: '120px 20px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="skeleton skeleton-title" style={{ width: '90%', height: '3rem', marginBottom: '20px' }}></div>
        <div className="skeleton skeleton-title" style={{ width: '60%', height: '3rem', marginBottom: '40px' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: '12px', marginBottom: '40px' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '1.2rem', marginBottom: '16px' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '1.2rem', marginBottom: '16px' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '1.2rem', marginBottom: '16px', width: '80%' }}></div>
        <br/>
        <div className="skeleton skeleton-text" style={{ height: '1.2rem', marginBottom: '16px' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '1.2rem', marginBottom: '16px', width: '90%' }}></div>
      </main>
    </div>
  );
}

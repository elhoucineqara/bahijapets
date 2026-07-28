import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#150a1c',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #261633 0%, #150a1c 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="https://bahijapets.vercel.app/logo.png" width="220" height="220" style={{ marginRight: '40px' }} />
          <h1 style={{
            fontSize: 100,
            color: '#c200fb',
            fontFamily: 'sans-serif',
            fontWeight: 800,
            margin: 0,
            textShadow: '0 4px 20px rgba(255, 0, 127, 0.4)'
          }}>
            BahijaPets
          </h1>
        </div>
        <p style={{
          fontSize: 36,
          color: '#eecbf7',
          marginTop: 40,
          fontWeight: 500,
          letterSpacing: '1px',
        }}>
          Best Pet Deals & Expert Reviews
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

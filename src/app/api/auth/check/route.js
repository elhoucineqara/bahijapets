import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false });
    }
    
    const adminPassword = process.env.ADMIN_PASSWORD || "BahijaPets2026!";
    const sessionSecret = process.env.SESSION_SECRET || "default_secret_string";
    
    const expectedToken = crypto
      .createHmac('sha256', sessionSecret)
      .update(adminPassword)
      .digest('hex');
      
    if (sessionCookie === expectedToken) {
      return NextResponse.json({ authenticated: true });
    }
    
    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false, error: "Error during verification" });
  }
}

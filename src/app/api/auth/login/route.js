import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }
    
    const adminPassword = process.env.ADMIN_PASSWORD || "BahijaPets2026!";
    const sessionSecret = process.env.SESSION_SECRET || "default_secret_string";
    
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
    
    // Generate a secure session token by hashing the password with our secret
    const token = crypto
      .createHmac('sha256', sessionSecret)
      .update(adminPassword)
      .digest('hex');
      
    const response = NextResponse.json({ success: true, message: "Successfully logged in" });
    
    // Set the HttpOnly cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error during login" }, { status: 500 });
  }
}

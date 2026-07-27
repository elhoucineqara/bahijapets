import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "Successfully logged out" });
    
    // Clear the cookie by setting maxAge to 0
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Server error during logout" }, { status: 500 });
  }
}

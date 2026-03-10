import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.APP_PASSWORD) {
    const response = NextResponse.json({ success: true });
    
    // Set a simple httpOnly cookie for session tracking
    response.cookies.set('session_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}

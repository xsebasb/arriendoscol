import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const expectedUser = process.env.ADMIN_USER || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'ArriendosCol2026*Pass';

    if (username === expectedUser && password === expectedPass) {
      const response = NextResponse.json({ success: true });
      // Set secure HTTP-only cookie
      response.cookies.set('admin_session', 'authenticated_admin_colombia', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Error en autenticación' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}

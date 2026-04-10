import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/authService';

const SESSION_COOKIE_NAME = 'admin_session';

export async function POST(req: NextRequest) {
  try {
    // Get token from cookie
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await authService.logout(token);
    }

    // Create response
    const response = NextResponse.json(
      { success: true, message: 'Logout realizado com sucesso' },
      { status: 200 }
    );

    // Delete session cookie
    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao processar logout' },
      { status: 500 }
    );
  }
}

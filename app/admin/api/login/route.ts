import { NextRequest, NextResponse } from 'next/server';
import { AdminLoginSchema } from '@/schemas/auth';
import { authService } from '@/services/authService';
import { ZodError } from 'zod';

const SESSION_COOKIE_NAME = 'admin_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validated = AdminLoginSchema.parse(body);

    // Authenticate
    const result = authService.authenticate(validated.username, validated.password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Erro na autenticação' },
        { status: 401 }
      );
    }

    // Create response
    const response = NextResponse.json(
      { success: true, message: 'Login realizado com sucesso' },
      { status: 200 }
    );

    // Set session cookie (secure, httpOnly, sameSite)
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: result.token || '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/admin',
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Erro de validação' },
        { status: 400 }
      );
    }

    console.error('Error processing admin login:', error);

    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Keep /admin public for the login screen and protect only nested admin pages.
  const isAdminNestedPage = pathname.startsWith('/admin/') && !pathname.startsWith('/admin/api');

  if (isAdminNestedPage) {
    const sessionCookie = req.cookies.get('admin_session')?.value;

    if (!sessionCookie) {
      // Redirect unauthenticated users to the admin login entrypoint.
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin';
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow access to API routes (auth validation happens in route handlers)
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

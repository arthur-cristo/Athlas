import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/auth/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Initial response for updating session
  const response = await updateSession(request);

  // Check auth status for protected routes
  if (!PUBLIC_ROUTES.includes(pathname)) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookies: Array<{ name: string; value: string; path?: string; expires?: Date }>) {
            cookies.forEach(({ name, value, path, expires }) => {
              response.cookies.set(name, value, { path, expires });
            });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

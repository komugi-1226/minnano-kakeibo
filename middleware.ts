import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // 一時的な対応：Supabase認証をスキップ
  // const supabase = createMiddlewareClient({ req, res });
  // const { data: { session } } = await supabase.auth.getSession();
  
  // 認証なしで常にアクセス許可する一時的な実装
  const session = true; // 仮のセッション状態

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Redirect logged-in users from auth pages to dashboard
  if ((req.nextUrl.pathname.startsWith('/auth/')) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}
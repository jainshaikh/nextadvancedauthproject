// import { NextRequest, NextResponse } from 'next/server';
// export { default } from 'next-auth/middleware';
// import { getToken } from 'next-auth/jwt';

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

//   if (
//     (token && url.pathname.startsWith('/sign-in')) ||
//     url.pathname.startsWith('/sign-up') ||
//     url.pathname.startsWith('/verify') ||
//     url.pathname.startsWith('/')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }
//   return NextResponse.redirect(new URL('/home', request.url));
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/sign-in', '/sign-up', '/', '/dashboard/:path*', '/verify/:path*'],
// };

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If user is authenticated and trying to access auth routes, redirect to /dashboard
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to /home
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Allow access to other routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/', '/dashboard/:path*', '/verify/:path*'],
};

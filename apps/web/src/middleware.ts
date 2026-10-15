import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type UserRole = 'ADMIN' | 'RESIDENT' | 'BUSINESS' | 'SERVICE_PROVIDER';

// Role dashboard route mapping
const ROLE_DEFAULT_DASHBOARDS: Record<UserRole, string> = {
  ADMIN: '/dashboard/admin',
  RESIDENT: '/dashboard/resident',
  BUSINESS: '/dashboard/business',
  SERVICE_PROVIDER: '/dashboard/service',
};

// Route access control matrix
// Defines which roles are strictly permitted to access specific path prefixes
const ROUTE_PERMISSIONS: { prefix: string; allowedRoles: UserRole[] }[] = [
  {
    prefix: '/dashboard/admin',
    allowedRoles: ['ADMIN'],
  },
  {
    prefix: '/admin',
    allowedRoles: ['ADMIN'],
  },
  {
    prefix: '/dashboard/business',
    allowedRoles: ['BUSINESS', 'ADMIN'],
  },
  {
    prefix: '/dashboard/service',
    allowedRoles: ['SERVICE_PROVIDER', 'ADMIN'],
  },
  {
    prefix: '/dashboard/resident',
    allowedRoles: ['RESIDENT', 'ADMIN'],
  },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract user_role from request cookies
  const roleCookie = request.cookies.get('user_role')?.value as UserRole | undefined;
  const currentRole: UserRole = roleCookie && ['ADMIN', 'RESIDENT', 'BUSINESS', 'SERVICE_PROVIDER'].includes(roleCookie)
    ? roleCookie
    : 'RESIDENT';

  // 1. Handle root /dashboard redirect to user's assigned role dashboard
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    const targetDashboard = ROLE_DEFAULT_DASHBOARDS[currentRole] || '/dashboard/resident';
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 2. Strict Role Isolation Check
  for (const rule of ROUTE_PERMISSIONS) {
    if (pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)) {
      const isAllowed = rule.allowedRoles.includes(currentRole);

      if (!isAllowed) {
        // Log unauthorized attempt in headers for diagnostic clarity
        console.warn(
          `[RBAC Middleware Blocked] Role "${currentRole}" attempted access to protected route: ${pathname}. Required: ${rule.allowedRoles.join(
            ', '
          )}`
        );

        // Redirect to /unauthorized with diagnostic query parameters
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        unauthorizedUrl.searchParams.set('attempted', pathname);
        unauthorizedUrl.searchParams.set('required', rule.allowedRoles[0]);
        unauthorizedUrl.searchParams.set('current', currentRole);

        const response = NextResponse.redirect(unauthorizedUrl);
        response.headers.set('x-rbac-denied', 'true');
        response.headers.set('x-rbac-required-role', rule.allowedRoles.join(','));
        response.headers.set('x-rbac-current-role', currentRole);
        return response;
      }
      break;
    }
  }

  return NextResponse.next();
}

// Next.js Middleware matcher configuration
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};

import { NextResponse, type NextRequest } from 'next/server'

// Protect app routes on the edge via lightweight cookie checks.
// Cookies expected (set client-side in AuthProvider/Onboarding):
// - ro_session=1 when a Supabase session is present
// - ro_guest=1 when onboarding guest flow is completed

const PROTECTED_PREFIXES = ['/dashboard', '/analytics', '/team']

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl
	const needsAuth = PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
	if (!needsAuth) return NextResponse.next()

	const hasSession = req.cookies.get('ro_session')?.value === '1'
	const isGuest = req.cookies.get('ro_guest')?.value === '1'
	// Debug: log decisions in dev only
	try { if (process.env.NODE_ENV !== 'production') console.log('[middleware]', { pathname, hasSession, isGuest }) } catch {}
	if (hasSession || isGuest) {
		const res = NextResponse.next()
		res.headers.set('x-ro-guard', 'allowed')
		return res
	}

	const url = req.nextUrl.clone()
	url.pathname = '/onboarding'
	const res = NextResponse.redirect(url)
	res.headers.set('x-ro-guard', 'redirect')
	return res
}

export const config = {
	matcher: ['/dashboard/:path*', '/analytics/:path*', '/team/:path*'],
}

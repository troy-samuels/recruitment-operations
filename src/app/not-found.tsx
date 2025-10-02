export const dynamic = 'force-dynamic'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 'normal' }}>
        Page Not Found
      </h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        href="/"
        style={{
          padding: '0.75rem 2rem',
          background: '#152B3C',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontWeight: '500'
        }}
      >
        Go Home
      </Link>
    </div>
  )
}

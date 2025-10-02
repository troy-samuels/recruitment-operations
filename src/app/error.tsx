'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>500</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 'normal' }}>
        Something went wrong
      </h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.75rem 2rem',
          background: '#152B3C',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: '500',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Recruitment Operations | Pipeline Management for UK Consultants',
  description: 'Real-time pipeline dashboard with drag-and-drop Kanban board, activity tracking, and smart reminders for UK recruitment consultants.',
  keywords: 'recruitment, pipeline, management, kanban, UK, consultants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
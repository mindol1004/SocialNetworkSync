import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MiniMeet - Authentication',
  description: 'Sign in or sign up to MiniMeet',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      {children}
    </div>
  )
}
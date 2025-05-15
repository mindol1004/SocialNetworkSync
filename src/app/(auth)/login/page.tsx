'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import { ArrowLeft, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { loginWithEmail, loginWithGoogle } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password')
      }
      
      await loginWithEmail(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      await loginWithGoogle()
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Google login error:', err)
      setError(err.message || 'Failed to sign in with Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to home
      </Link>
      
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('welcomeBack')}</CardTitle>
          <CardDescription>
            {t('signInToAccount')}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleEmailLogin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Button 
                type="button"
                variant="outline" 
                className="bg-white hover:bg-gray-50 text-black"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                  <path fill="#EA4335" d="M12 5c1.617 0 3.101.554 4.28 1.478l3.301-3.319C17.698 1.13 15.012 0 12 0 7.392 0 3.375 2.54 1.332 6.519l3.857 2.98C6.223 6.652 8.918 5 12 5z" />
                  <path fill="#4285F4" d="M23.822 12.25c0-.934-.082-1.827-.236-2.694H12v4.622h6.736c-.272 1.58-1.24 3.044-2.873 3.937v3.04h4.595C22.6 18.845 23.822 15.78 23.822 12.25z" />
                  <path fill="#34A853" d="M5.418 14.501c-.365-.691-.573-1.454-.573-2.251 0-.821.223-1.6.573-2.251l-3.857-2.98C.608 8.678 0 10.538 0 12.5c0 1.873.572 3.657 1.615 5.169l3.803-3.168z" />
                  <path fill="#FBBC05" d="M12 24c3.761 0 6.926-1.235 9.234-3.345l-4.595-3.04c-1.267.782-2.943 1.385-4.639 1.385-3.082 0-5.776-1.652-6.808-4.499l-3.803 3.168C3.375 21.46 7.392 24 12 24z" />
                </svg>
                Sign in with Google
              </Button>
            </div>
          </CardContent>
        </form>
        
        <CardFooter className="flex flex-col space-y-4 items-center justify-center border-t p-6">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
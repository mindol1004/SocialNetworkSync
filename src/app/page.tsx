import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center flex flex-col">
        <h1 className="text-4xl font-bold text-center mb-6">Welcome to MiniMeet</h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-10">
          A minimalist social networking platform with clean UX
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs justify-center">
          <Link 
            href="/login" 
            className="w-full"
          >
            <Button 
              className="w-full"
              variant="default"
            >
              Log in
            </Button>
          </Link>
          <Link 
            href="/register" 
            className="w-full"
          >
            <Button
              className="w-full"
              variant="outline"
            >
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
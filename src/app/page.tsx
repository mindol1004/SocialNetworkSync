import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-6">Welcome to MiniMeet</h1>
        <p className="text-xl mb-6">An Apple-inspired minimalist social network with clean UX</p>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-6 py-3 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-3 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  )
}
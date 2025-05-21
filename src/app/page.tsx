'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Users, Globe, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/server/infra/db/firebase/firebase';

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser()
      if (user) {
        setIsLoggedIn(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // 로그인 상태에 따라 자동으로 대시보드로 리디렉션
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      router.push('/dashboard')
    }
  }, [isLoggedIn, isLoading, router])

  // 로딩 중이면 빈 화면 표시
  if (isLoading) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">MiniMeet</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#testimonials" className="text-muted-foreground transition-colors hover:text-foreground">
              Testimonials
            </Link>
            <Link href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 섹션 */}
      <main className="flex-1">
        {/* 히어로 섹션 */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 via-muted/20 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Connect with friends on MiniMeet</h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A minimalist social networking platform designed with a focus on clean user experience and intuitive design.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-muted rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-card rounded-lg shadow-lg p-6 flex flex-col">
                      <div className="flex items-center gap-3 border-b pb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20"></div>
                        <div className="space-y-1">
                          <div className="w-24 h-3 bg-muted-foreground/20 rounded-full"></div>
                          <div className="w-16 h-2 bg-muted-foreground/10 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center space-y-3 p-3">
                        <div className="w-full h-4 bg-muted-foreground/10 rounded-full"></div>
                        <div className="w-5/6 h-4 bg-muted-foreground/10 rounded-full"></div>
                        <div className="w-4/6 h-4 bg-muted-foreground/10 rounded-full"></div>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                        <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                        <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 기능 섹션 */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features that make connecting easier</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover how MiniMeet helps you connect with friends and share moments that matter.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Connect with Friends</h3>
                <p className="text-center text-muted-foreground">
                  Find and connect with friends, family, and like-minded individuals.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Explore Content</h3>
                <p className="text-center text-muted-foreground">
                  Discover trending topics and content from around the world.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Privacy First</h3>
                <p className="text-center text-muted-foreground">
                  Your privacy matters. Control who sees your content and information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join MiniMeet Today</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Connect with friends, share moments, and discover new content.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-1.5">
                    Create an Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 px-4 md:px-6">
          <div className="md:flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">MiniMeet</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              A minimalist social networking platform designed with a focus on clean user experience and intuitive design.
            </p>
          </div>
          <nav className="md:flex-1 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="border-t py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MiniMeet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'
import MobileNavigation from './MobileNavigation'
import { getCurrentUser } from '@/lib/firebase'

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Check if user is authenticated
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [router])
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex flex-1 pt-16">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="fixed h-full w-64 border-r border-gray-200 dark:border-gray-700">
            <Sidebar />
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 px-4 py-6 md:px-6">
          {children}
        </main>
        
        {/* Right sidebar (only on larger screens) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="fixed h-full w-80 border-l border-gray-200 dark:border-gray-700">
            <RightSidebar />
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isMobile && <MobileNavigation />}
    </div>
  )
}
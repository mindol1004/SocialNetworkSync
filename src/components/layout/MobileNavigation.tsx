'use client'

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";

export default function MobileNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const handleNewPost = () => {
    // Scroll to top where the create post component is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 md:hidden">
      <div className="grid grid-cols-5 h-16">
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setLocation('/');
          }}
          className={`flex flex-col items-center justify-center ${location === '/' ? 'text-primary' : 'text-neutral-600 dark:text-neutral-400'}`}
        >
          <span className="material-icons text-[22px]">home</span>
          <span className="text-xs mt-0.5">{t('home')}</span>
        </a>
        
        <a 
          href="/explore"
          onClick={(e) => {
            e.preventDefault();
            setLocation('/explore');
          }}
          className={`flex flex-col items-center justify-center ${location === '/explore' ? 'text-primary' : 'text-neutral-600 dark:text-neutral-400'}`}
        >
          <span className="material-icons text-[22px]">explore</span>
          <span className="text-xs mt-0.5">{t('explore')}</span>
        </a>
        
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNewPost();
          }}
          className="flex flex-col items-center justify-center"
        >
          <div className="bg-primary text-white p-2 rounded-full">
            <span className="material-icons text-[22px]">add</span>
          </div>
        </a>
        
        <a 
          href="/notifications"
          onClick={(e) => {
            e.preventDefault();
            setLocation('/notifications');
          }}
          className={`flex flex-col items-center justify-center ${location === '/notifications' ? 'text-primary' : 'text-neutral-600 dark:text-neutral-400'}`}
        >
          <span className="material-icons text-[22px]">notifications</span>
          <span className="text-xs mt-0.5">{t('notifications')}</span>
        </a>
        
        <a 
          href={user ? `/profile/${user.email?.split('@')[0]}` : "/login"}
          onClick={(e) => {
            e.preventDefault();
            setLocation(user ? `/profile/${user.email?.split('@')[0]}` : "/login");
          }}
          className={`flex flex-col items-center justify-center ${location.includes('/profile') ? 'text-primary' : 'text-neutral-600 dark:text-neutral-400'}`}
        >
          <span className="material-icons text-[22px]">person</span>
          <span className="text-xs mt-0.5">{t('profile')}</span>
        </a>
      </div>
    </nav>
  );
}

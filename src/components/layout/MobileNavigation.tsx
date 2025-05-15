
'use client'

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react';

export default function MobileNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const handleNewPost = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { href: "/dashboard", icon: Home, label: t('home') },
    { href: "/explore", icon: Search, label: t('explore') },
    { onClick: handleNewPost, icon: PlusCircle, label: t('newPost') },
    { href: "/notifications", icon: Bell, label: t('notifications') },
    { href: user ? `/profile/${user.email?.split('@')[0]}` : "/login", icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item, index) => (
          item.onClick ? (
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center text-neutral-600 dark:text-neutral-400"
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ) : (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center justify-center ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        ))}
      </div>
    </nav>
  );
}

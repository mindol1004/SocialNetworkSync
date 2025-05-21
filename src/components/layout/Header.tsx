'use client'

import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useAuth";
import { Menu, Bell, Search, Home, Compass, MessageSquare, LogOut, PenSquare } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'home' },
  { path: '/explore', icon: <Compass className="w-5 h-5" />, label: 'explore' },
  { path: '/messages', icon: <MessageSquare className="w-5 h-5" />, label: 'messages' },
];
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";

export default function Header() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleNewPost = () => {
    router.push('/dashboard?new=post');
  };

  const handleLogout = () => {
    // logout();
    // router.push('/login');
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="container flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <DialogTitle className="sr-only">Sidebar Menu</DialogTitle>
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4">
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center px-4 py-3 rounded-xl transition ${
                        pathname === item.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3 font-medium">{item.label}</span>
                    </Link>
                  ))}

                  {user && (
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-3 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="ml-3 font-medium">{t('logout')}</span>
                    </button>
                  )}
                </nav>
              </div>
              <div className="p-4">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={handleNewPost}
                >
                  <PenSquare className="w-5 h-5 mr-2" />
                  {t('newPost')}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 flex-1">
          <Link href="/dashboard" className="font-semibold text-xl">
            MiniMeet
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button variant="ghost" size="icon" onClick={(e) => handleSearch(e as any)}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          {!user && (
            <Link href="/login">
              <Button>{t('login')}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
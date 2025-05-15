'use client'

import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useAuth";
import { Menu, Bell, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import Sidebar from './Sidebar';

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
            <Sidebar />
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
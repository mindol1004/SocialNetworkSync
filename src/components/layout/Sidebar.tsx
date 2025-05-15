'use client'

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Home, Search, Bell, Mail, Bookmark, User, Settings, LogOut, PenSquare } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { user, clearUser } = useAuthStore();
  const { toast } = useToast();

  const navItems = [
    { path: "/", icon: <Home size={20} />, label: t('home') },
    { path: "/explore", icon: <Search size={20} />, label: t('explore') },
    { path: "/notifications", icon: <Bell size={20} />, label: t('notifications') },
    { path: "/messages", icon: <Mail size={20} />, label: t('messages') },
    { path: "/bookmarks", icon: <Bookmark size={20} />, label: t('bookmarks') },
    { path: user ? `/profile/${user.email?.split('@')[0]}` : "/login", icon: <User size={20} />, label: t('profile') },
    { path: "/settings", icon: <Settings size={20} />, label: t('settings') }
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearUser();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out from your account"
      });
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to log out";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleNewPost = () => {
    // Scroll to top where the create post component is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="hidden md:flex flex-col w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 ${
                pathname === item.path 
                  ? 'text-primary dark:text-primary bg-blue-50 dark:bg-opacity-10' 
                  : 'text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              } rounded-xl transition`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {user && (
            <button 
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
            >
              <span className="mr-3"><LogOut size={20} /></span>
              <span className="font-medium">{t('logout')}</span>
            </button>
          )}
        </nav>
      </div>
      
      <div className="mt-auto p-4">
        <Button 
          className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-full transition"
          onClick={handleNewPost}
        >
          {t('newPost')}
        </Button>
      </div>
    </div>
  );
}

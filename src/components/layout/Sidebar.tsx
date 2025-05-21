
'use client'

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
// import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Home, Search, Bell, Mail, Bookmark, User, Settings, LogOut, PenSquare } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { user, clearUser } = useAuthStore();
  const { toast } = useToast();

  const navItems = [
    { path: "/dashboard", icon: <Home className="w-5 h-5" />, label: t('home') },
    { path: "/explore", icon: <Search className="w-5 h-5" />, label: t('explore') },
    { path: "/notifications", icon: <Bell className="w-5 h-5" />, label: t('notifications') },
    { path: "/messages", icon: <Mail className="w-5 h-5" />, label: t('messages') },
    { path: "/bookmarks", icon: <Bookmark className="w-5 h-5" />, label: t('bookmarks') },
    { path: user ? `/profile/${user.email?.split('@')[0]}` : "/login", icon: <User className="w-5 h-5" />, label: t('profile') },
    { path: "/settings", icon: <Settings className="w-5 h-5" />, label: t('settings') }
  ];

  const handleLogout = async () => {
    try {
      // await logoutUser();
      clearUser();
      toast({
        title: "로그아웃 성공",
        description: "계정에서 로그아웃되었습니다"
      });
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "로그아웃 실패";
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleNewPost = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="hidden md:flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col flex-1 p-4">
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
  );
}

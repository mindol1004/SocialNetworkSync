import { useState } from "react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useAuth";
import { useTranslation } from "@/lib/i18n";

export default function Header() {
  const [_, setLocation] = useLocation();
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const navigateTo = (path: string) => {
    setLocation(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-primary dark:text-white font-semibold text-xl">
              MiniMeet
            </a>
          </div>
          
          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Input 
                type="text" 
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-800 border-none rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute left-3 top-2 text-gray-400">
                <span className="material-icons text-sm">search</span>
              </span>
            </form>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <button 
                  className="relative text-neutral-800 dark:text-white"
                  onClick={() => navigateTo('/notifications')}
                >
                  <span className="material-icons">notifications</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">3</span>
                </button>
                
                <button 
                  className="relative text-neutral-800 dark:text-white"
                  onClick={() => navigateTo('/messages')}
                >
                  <span className="material-icons">mail</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">2</span>
                </button>
              </>
            )}
            
            <div className="ml-3 relative">
              <div>
                <button 
                  type="button" 
                  className="flex items-center"
                  onClick={() => navigateTo(user ? `/profile/${user.email?.split('@')[0]}` : '/login')}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user?.photoURL || ""}
                      alt="User profile"
                    />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-800 dark:text-white hidden md:inline">{t('theme')}</span>
              <Switch 
                id="theme-toggle" 
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

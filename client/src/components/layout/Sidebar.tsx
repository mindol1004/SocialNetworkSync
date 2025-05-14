import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user, clearUser } = useAuthStore();
  const { toast } = useToast();

  const navItems = [
    { path: "/", icon: "home", label: t('home') },
    { path: "/explore", icon: "explore", label: t('explore') },
    { path: "/notifications", icon: "notifications", label: t('notifications') },
    { path: "/messages", icon: "mail", label: t('messages') },
    { path: "/bookmarks", icon: "bookmark", label: t('bookmarks') },
    { path: user ? `/profile/${user.email?.split('@')[0]}` : "/login", icon: "person", label: t('profile') },
    { path: "/settings", icon: "settings", label: t('settings') }
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearUser();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out from your account"
      });
      setLocation('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const handleNewPost = () => {
    // Scroll to top where the create post component is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <a 
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                setLocation(item.path);
              }}
              className={`flex items-center px-4 py-3 ${
                location === item.path 
                  ? 'text-primary dark:text-primary bg-blue-50 dark:bg-opacity-10' 
                  : 'text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              } rounded-xl transition`}
            >
              <span className="material-icons mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}

          {user && (
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="flex items-center px-4 py-3 text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
            >
              <span className="material-icons mr-3">logout</span>
              <span className="font-medium">{t('logout')}</span>
            </a>
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
    </aside>
  );
}

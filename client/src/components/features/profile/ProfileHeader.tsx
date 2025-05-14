import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { followUser, unfollowUser, getFollowStatus } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { getDatabase, ref, get } from "firebase/database";

interface ProfileHeaderProps {
  user: any; // The profile user
  isCurrentUser: boolean;
  postCount: number;
}

export default function ProfileHeader({ user, isCurrentUser, postCount }: ProfileHeaderProps) {
  const [_, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        const database = getDatabase();
        
        // Get followers count
        const followersRef = ref(database, `users/${user.uid}/followers`);
        const followersSnapshot = await get(followersRef);
        
        if (followersSnapshot.exists()) {
          setFollowersCount(Object.keys(followersSnapshot.val()).length);
        }
        
        // Get following count
        const followingRef = ref(database, `users/${user.uid}/following`);
        const followingSnapshot = await get(followingRef);
        
        if (followingSnapshot.exists()) {
          setFollowingCount(Object.keys(followingSnapshot.val()).length);
        }
        
        // Check if current user is following this profile
        if (currentUser && !isCurrentUser) {
          const isFollowingStatus = await getFollowStatus(currentUser.uid, user.uid);
          setIsFollowing(isFollowingStatus);
        }
      } catch (error) {
        console.error("Error fetching follow data:", error);
      }
    };
    
    fetchFollowData();
  }, [user.uid, currentUser, isCurrentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      setLocation('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isFollowing) {
        await unfollowUser(currentUser.uid, user.uid);
        setFollowersCount(prev => prev - 1);
        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${user.displayName}`
        });
      } else {
        await followUser(currentUser.uid, user.uid);
        setFollowersCount(prev => prev + 1);
        setIsFollowing(true);
        toast({
          title: "Following",
          description: `You are now following ${user.displayName}`
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setLocation('/settings');
  };

  return (
    <div className="bg-white dark:bg-neutral-900">
      <div className="relative h-40 bg-gradient-to-r from-blue-500/20 to-primary/20">
        {/* Cover photo would go here */}
      </div>
      
      <div className="max-w-4xl mx-auto px-4 pb-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4">
          <Avatar className="w-32 h-32 border-4 border-white dark:border-neutral-900">
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback className="text-4xl">{user.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="sm:ml-4 mt-4 sm:mt-0 flex-1">
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-neutral-500">@{user.username}</p>
            
            {user.bio && (
              <p className="mt-2">{user.bio}</p>
            )}
          </div>
          
          <div className="mt-4 sm:mt-0">
            {isCurrentUser ? (
              <Button 
                onClick={handleEditProfile}
                className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white"
              >
                {t('editProfile')}
              </Button>
            ) : (
              <Button 
                onClick={handleFollowToggle}
                className={isFollowing 
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"}
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  isFollowing ? t('following') : t('follow')
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex border-b border-neutral-200 dark:border-neutral-800">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent">
              <TabsTrigger value="posts" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <div className="text-center">
                  <div className="font-semibold">{postCount}</div>
                  <div className="text-sm text-neutral-500">{t('posts')}</div>
                </div>
              </TabsTrigger>
              <TabsTrigger value="followers" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <div className="text-center">
                  <div className="font-semibold">{followersCount}</div>
                  <div className="text-sm text-neutral-500">{t('followers')}</div>
                </div>
              </TabsTrigger>
              <TabsTrigger value="following" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <div className="text-center">
                  <div className="font-semibold">{followingCount}</div>
                  <div className="text-sm text-neutral-500">{t('following')}</div>
                </div>
              </TabsTrigger>
            </TabsList>
            
            {/* Tab content is rendered in the parent component */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

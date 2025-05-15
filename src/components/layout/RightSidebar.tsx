'use client'

import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDatabase, ref, get } from "firebase/database";
import { followUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";

interface TrendingTopic {
  name: string;
  category: string;
  postCount: number;
}

interface SuggestedUser {
  uid: string;
  displayName: string;
  username: string;
  photoURL: string;
  profession: string;
}

export default function RightSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuthStore();
  
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Mock trending topics - in a real app, this would come from backend
    setTrendingTopics([
      {
        name: "#MinimalistDesign",
        category: "Design",
        postCount: 2400
      },
      {
        name: "#AppleEvent",
        category: "Technology",
        postCount: 18700
      },
      {
        name: "#WorkFromAnywhere",
        category: "Lifestyle",
        postCount: 5200
      }
    ]);

    // Fetch suggested users
    const fetchSuggestedUsers = async () => {
      if (!user) return;
      
      try {
        const database = getDatabase();
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const suggestedUsersArray: SuggestedUser[] = [];
          
          // Random professions for demo
          const professions = [
            "UX Designer", "Web Developer", "Photographer",
            "Product Manager", "Content Creator"
          ];
          
          for (const uid in usersData) {
            // Skip current user
            if (uid === user.uid) continue;
            
            const userData = usersData[uid];
            suggestedUsersArray.push({
              uid,
              displayName: userData.displayName,
              username: userData.username,
              photoURL: userData.photoURL,
              profession: professions[Math.floor(Math.random() * professions.length)]
            });
            
            // Just get 3 users
            if (suggestedUsersArray.length >= 3) break;
          }
          
          setSuggestedUsers(suggestedUsersArray);
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };
    
    fetchSuggestedUsers();
  }, [user]);

  const handleFollow = async (userId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      await followUser(user.uid, userId);
      
      // Update local state
      setFollowingStates(prev => ({
        ...prev,
        [userId]: true
      }));
      
      toast({
        title: "Success",
        description: "You are now following this user"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to follow user";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="hidden lg:block w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4">{t('trendingTopics')}</h3>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div 
                key={index} 
                className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-lg transition"
                onClick={() => router.push(`/explore?topic=${encodeURIComponent(topic.name)}`)}
              >
                <p className="text-xs text-neutral-500">{topic.category}</p>
                <p className="font-medium">{topic.name}</p>
                <p className="text-xs text-neutral-500">{topic.postCount.toLocaleString()} posts</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{t('suggestedConnections')}</h3>
            <Link 
              href="/explore?tab=people" 
              className="text-primary text-sm"
            >
              {t('seeAll')}
            </Link>
          </div>
          
          <div className="space-y-4">
            {suggestedUsers.map((suggestedUser) => (
              <div key={suggestedUser.uid} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={suggestedUser.photoURL} alt={suggestedUser.displayName} />
                    <AvatarFallback>{suggestedUser.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p 
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => setLocation(`/profile/${suggestedUser.username}`)}
                    >
                      {suggestedUser.displayName}
                    </p>
                    <p className="text-xs text-neutral-500">{suggestedUser.profession}</p>
                  </div>
                </div>
                <Button 
                  className={`
                    rounded-full px-3 py-1 text-xs transition
                    ${followingStates[suggestedUser.uid] 
                      ? 'bg-primary text-white' 
                      : 'text-primary border border-primary hover:bg-primary hover:text-white'}
                  `}
                  onClick={() => handleFollow(suggestedUser.uid)}
                >
                  {followingStates[suggestedUser.uid] ? t('following') : t('follow')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

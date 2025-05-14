import { useEffect, useState } from "react";
import { useParams } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import PostCard from "@/components/features/post/PostCard";
import { getUserByUsername, getPosts } from "@/lib/firebase";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { t } = useTranslation();
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();
  
  const [profileUser, setProfileUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const user = await getUserByUsername(username);
        if (!user) {
          setError("User not found");
          setLoading(false);
          return;
        }
        
        setProfileUser(user);
        
        // Fetch all posts and filter for this user
        const allPosts = await getPosts();
        const userPosts = allPosts.filter((post: any) => post.userId === user.uid);
        
        // Add user data to each post
        const postsWithUser = userPosts.map((post: any) => ({
          ...post,
          user: {
            displayName: user.displayName,
            photoURL: user.photoURL,
            username: user.username
          }
        }));
        
        setPosts(postsWithUser);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchProfileData();
    }
  }, [username, toast]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-2">{t('loading')}</p>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !profileUser) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold">{error || "User not found"}</h2>
          <p className="text-neutral-500 mt-2">The user you're looking for doesn't exist or has been removed</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <ProfileHeader 
          user={profileUser} 
          isCurrentUser={currentUser?.uid === profileUser.uid}
          postCount={posts.length}
        />
        
        <div className="max-w-2xl mx-auto px-4 py-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id}
                post={post}
                currentUser={currentUser}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-xl font-medium mb-2">No posts yet</p>
              <p className="text-neutral-500 mb-6">
                {currentUser?.uid === profileUser.uid 
                  ? "Share your first post with the world!"
                  : `${profileUser.displayName} hasn't posted anything yet.`
                }
              </p>
              
              {currentUser?.uid === profileUser.uid && (
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-full"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Create Post
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

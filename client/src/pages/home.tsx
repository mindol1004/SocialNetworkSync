import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CreatePostCard from "@/components/features/post/CreatePostCard";
import PostCard from "@/components/features/post/PostCard";
import StorySection from "@/components/features/post/StorySection";
import { getPosts, getUserById } from "@/lib/firebase";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";

interface PostWithUser {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
  userId: string;
  likes: Record<string, boolean>;
  comments: Record<string, any>;
  user: {
    displayName: string;
    photoURL: string;
    username: string;
  };
}

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = await getPosts();
        
        // Fetch user data for each post
        const postsWithUsers = await Promise.all(
          postsData.map(async (post: any) => {
            const userData = await getUserById(post.userId);
            return {
              ...post,
              user: {
                displayName: userData.displayName,
                photoURL: userData.photoURL,
                username: userData.username
              }
            };
          })
        );
        
        setPosts(postsWithUsers);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handlePostCreated = async (newPostId: string) => {
    // Refetch all posts to get the latest
    const postsData = await getPosts();
    
    // Fetch user data for each post
    const postsWithUsers = await Promise.all(
      postsData.map(async (post: any) => {
        const userData = await getUserById(post.userId);
        return {
          ...post,
          user: {
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            username: userData.username
          }
        };
      })
    );
    
    setPosts(postsWithUsers);
  };

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto px-4 md:px-0 pb-16 md:pb-0">
        <div className="max-w-2xl mx-auto py-6">
          {user && (
            <CreatePostCard 
              user={user} 
              onPostCreated={handlePostCreated} 
            />
          )}
          
          <StorySection />
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">{t('loading')}</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id}
                post={post} 
                currentUser={user}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import PostCard from "@/components/features/post/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPosts, getUserById } from "@/lib/firebase";
import { getDatabase, ref, get } from "firebase/database";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/lib/i18n";

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

interface TrendingTopic {
  name: string;
  category: string;
  postCount: number;
}

interface UserSuggestion {
  uid: string;
  displayName: string;
  username: string;
  photoURL: string;
  bio?: string;
  profession?: string;
}

export default function Explore() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [_, setLocation] = useLocation();
  
  const [trendingPosts, setTrendingPosts] = useState<PostWithUser[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<UserSuggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts
        const postsData = await getPosts();
        
        // Add user data to each post
        const postsWithUsers = await Promise.all(
          postsData.slice(0, 10).map(async (post: any) => {
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
        
        // Sort by likes count (popular posts)
        const popularPosts = postsWithUsers.sort((a: any, b: any) => {
          const aLikes = a.likes ? Object.keys(a.likes).length : 0;
          const bLikes = b.likes ? Object.keys(b.likes).length : 0;
          return bLikes - aLikes;
        });
        
        setTrendingPosts(popularPosts);
        
        // Fetch suggested users
        const database = getDatabase();
        const usersRef = ref(database, 'users');
        const usersSnapshot = await get(usersRef);
        
        if (usersSnapshot.exists()) {
          const usersData = usersSnapshot.val();
          const suggestedUsersData: UserSuggestion[] = [];
          
          for (const uid in usersData) {
            // Skip current user
            if (user && uid === user.uid) continue;
            
            const userData = usersData[uid];
            suggestedUsersData.push({
              uid,
              displayName: userData.displayName,
              username: userData.username,
              photoURL: userData.photoURL,
              bio: userData.bio,
              profession: userData.profession || getRandomProfession()
            });
            
            // Limit to 5 suggestions
            if (suggestedUsersData.length >= 5) break;
          }
          
          setSuggestedUsers(suggestedUsersData);
        }
        
        // Set mock trending topics (in a real app, these would be generated from post data)
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
          },
          {
            name: "#SustainableLiving",
            category: "Environment",
            postCount: 3800
          },
          {
            name: "#DigitalArt",
            category: "Arts",
            postCount: 7600
          }
        ]);
        
      } catch (error) {
        console.error("Error fetching explore data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExploreData();
  }, [user]);
  
  const getRandomProfession = () => {
    const professions = [
      "UX Designer",
      "Web Developer",
      "Photographer",
      "Product Manager",
      "Content Creator",
      "Marketing Specialist",
      "Data Scientist",
      "UI Designer",
      "Software Engineer",
      "Creative Director"
    ];
    
    return professions[Math.floor(Math.random() * professions.length)];
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search the database
    console.log("Searching for:", searchTerm);
  };
  
  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-16 md:pb-6">
        <div className="max-w-6xl mx-auto py-6">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-neutral-100 dark:bg-neutral-800 border-none rounded-full py-3 pl-12 pr-4"
                />
                <span className="absolute left-4 top-3 text-gray-400">
                  <span className="material-icons">search</span>
                </span>
                <Button 
                  type="submit"
                  className="absolute right-2 top-1.5 bg-primary hover:bg-primary/90 text-white rounded-full h-8 px-4 text-sm"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
          
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trending Posts</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {loading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : trendingPosts.length > 0 ? (
                        <ScrollArea className="h-[600px]">
                          <div className="space-y-0">
                            {trendingPosts.map((post) => (
                              <PostCard 
                                key={post.id}
                                post={post}
                                currentUser={user}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-neutral-500">No trending posts yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trending Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {trendingTopics.map((topic, index) => (
                          <div 
                            key={index}
                            className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-lg transition"
                          >
                            <p className="text-xs text-neutral-500">{topic.category}</p>
                            <p className="font-medium">{topic.name}</p>
                            <p className="text-xs text-neutral-500">{topic.postCount.toLocaleString()} posts</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Suggested Connections</CardTitle>
                      <Button variant="link" className="text-primary">
                        See all
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {suggestedUsers.map((user) => (
                          <div key={user.uid} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={user.photoURL} alt={user.displayName} />
                                <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p 
                                  className="font-medium hover:text-primary cursor-pointer"
                                  onClick={() => setLocation(`/profile/${user.username}`)}
                                >
                                  {user.displayName}
                                </p>
                                <p className="text-xs text-neutral-500">{user.profession}</p>
                              </div>
                            </div>
                            <Button 
                              className="text-primary border border-primary rounded-full px-3 py-1 text-xs hover:bg-primary hover:text-white transition"
                            >
                              Follow
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="people" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>People to Follow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestedUsers.map((user) => (
                      <Card key={user.uid} className="overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
                        <CardContent className="pt-0 relative">
                          <Avatar className="h-16 w-16 border-4 border-white dark:border-neutral-900 absolute -top-8">
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                            <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="mt-10 mb-4">
                            <p 
                              className="font-semibold text-lg cursor-pointer hover:text-primary"
                              onClick={() => setLocation(`/profile/${user.username}`)}
                            >
                              {user.displayName}
                            </p>
                            <p className="text-sm text-neutral-500">@{user.username}</p>
                            <p className="text-sm text-neutral-500 mt-1">{user.profession}</p>
                          </div>
                          <Button 
                            className="w-full text-primary border border-primary hover:bg-primary hover:text-white transition"
                            variant="outline"
                          >
                            Follow
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="topics" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingTopics.map((topic, index) => (
                      <Card key={index} className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
                        <CardContent className="p-6">
                          <p className="text-xs text-neutral-500 uppercase tracking-wider">{topic.category}</p>
                          <p className="font-semibold text-xl my-2">{topic.name}</p>
                          <p className="text-sm text-neutral-500">{topic.postCount.toLocaleString()} posts</p>
                          <Button 
                            className="mt-4 bg-primary hover:bg-primary/90 text-white"
                            size="sm"
                          >
                            Follow Topic
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="photos" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {trendingPosts.filter(post => post.imageUrl).map((post) => (
                      <div 
                        key={post.id}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
                        onClick={() => setLocation('/')}
                      >
                        <img 
                          src={post.imageUrl} 
                          alt="Post" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  Bookmark,
  Heart,
  Home,
  Image as ImageIcon,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings,
  User,
  Users,
} from 'lucide-react'

export default function DashboardPage() {
  // Mock data for demonstration
  const posts = [
    {
      id: 1,
      author: {
        name: 'Jane Cooper',
        avatar: 'https://i.pravatar.cc/150?img=1',
        username: 'janecooper',
      },
      content: 'Just finished my morning hike! The view from the top was absolutely breathtaking today. #NatureLover #MorningRoutine',
      timestamp: '3 hours ago',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
      comments: 5,
      likes: 24,
    },
    {
      id: 2,
      author: {
        name: 'Alex Morgan',
        avatar: 'https://i.pravatar.cc/150?img=2',
        username: 'alexmorgan',
      },
      content: 'Excited to announce that I\'ll be speaking at the upcoming tech conference next month! Looking forward to sharing insights on UI/UX design principles. #TechConference #Design',
      timestamp: '5 hours ago',
      comments: 12,
      likes: 45,
    },
    {
      id: 3,
      author: {
        name: 'David Kim',
        avatar: 'https://i.pravatar.cc/150?img=3',
        username: 'davidkim',
      },
      content: 'Just finished reading this amazing book. Highly recommend it to anyone interested in personal development and productivity.',
      timestamp: '7 hours ago',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2071&auto=format&fit=crop',
      comments: 8,
      likes: 37,
    },
  ]

  const suggestedUsers = [
    {
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=4',
      username: 'sarahwilson',
      bio: 'Digital Marketing Specialist',
    },
    {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=5',
      username: 'michaelchen',
      bio: 'Software Engineer',
    },
    {
      name: 'Emma Thompson',
      avatar: 'https://i.pravatar.cc/150?img=6',
      username: 'emmathompson',
      bio: 'Content Creator',
    },
  ]

  const trends = [
    { tag: '#TechTalks', posts: '2.5k posts' },
    { tag: '#Photography', posts: '1.8k posts' },
    { tag: '#WorkFromHome', posts: '1.2k posts' },
    { tag: '#Recipes', posts: '980 posts' },
    { tag: '#Fitness', posts: '870 posts' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-xl">MiniMeet</span>
          </div>
          
          <div className="flex flex-1 items-center justify-center px-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for people, posts, and tags..."
                className="w-full pl-8 rounded-full bg-muted"
              />
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/150?img=8" alt="Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
        {/* Left Sidebar - Navigation and Profile */}
        <aside className="hidden md:flex flex-col gap-6 md:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://i.pravatar.cc/150?img=8" alt="Profile" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>User Name</CardTitle>
                <CardDescription>@username</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="text-center">
                  <p className="font-semibold">158</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">2.5k</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">1.2k</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col gap-2 pt-4">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/saved">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Saved Posts
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" asChild>
                <Link href="/logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trends.map((trend, index) => (
                <div key={index} className="flex justify-between items-center">
                  <Link href="#" className="text-primary hover:underline">
                    {trend.tag}
                  </Link>
                  <span className="text-xs text-muted-foreground">{trend.posts}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
        
        {/* Main Content Area */}
        <main className="col-span-1 md:col-span-2 space-y-6">
          {/* Create Post Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?img=8" alt="Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="What's on your mind?"
                    className="border-0 focus-visible:ring-0 px-3 py-6 shadow-none"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Tag People
                      </Button>
                    </div>
                    <Button size="sm">Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Feed Tabs */}
          <Tabs defaultValue="for-you">
            <TabsList className="w-full bg-muted mb-4">
              <TabsTrigger value="for-you" className="flex-1">For You</TabsTrigger>
              <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
              <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="for-you" className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-0 flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{post.author.name}</CardTitle>
                          <CardDescription>@{post.author.username} · {post.timestamp}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Save post</DropdownMenuItem>
                            <DropdownMenuItem>Report post</DropdownMenuItem>
                            <DropdownMenuItem>Hide posts from this user</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <p className="mb-3">{post.content}</p>
                    {post.image && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <img 
                          src={post.image} 
                          alt="Post image"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="following">
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Posts from people you follow will appear here.</p>
                <Button>Find people to follow</Button>
              </Card>
            </TabsContent>
            
            <TabsContent value="recent">
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">This tab shows the latest posts.</p>
                <Button>Refresh posts</Button>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        
        {/* Right sidebar - Suggestions */}
        <aside className="hidden lg:block md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>People you might know</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium leading-none mb-1">{user.name}</p>
                    <p className="text-sm text-muted-foreground mb-1">@{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.bio}</p>
                  </div>
                  <Button size="sm" variant="outline">Follow</Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                See More
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  )
}
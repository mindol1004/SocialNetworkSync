'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  CalendarDays, 
  MapPin, 
  Link as LinkIcon, 
  Edit, 
  Grid,
  List,
  Loader,
  User
} from 'lucide-react'
import { getCurrentUser, getUserById, getPosts } from '@/lib/firebase'

export default function ProfilePage() {
  const router = useRouter()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [userDisplayName, setUserDisplayName] = useState('User Name')
  const [userUsername, setUserUsername] = useState('@username')
  const [userBio, setUserBio] = useState('')
  const [userLocation, setUserLocation] = useState('')
  const [userWebsite, setUserWebsite] = useState('')
  const [userJoinDate, setUserJoinDate] = useState(new Date())
  const [userProfileImage, setUserProfileImage] = useState('')

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUserId(user.uid)
    } else {
      // 로그인하지 않은 경우 로그인 페이지로 리디렉션
      router.push('/login')
    }
  }, [router])

  // 사용자 정보 쿼리
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: () => currentUserId ? getUserById(currentUserId) : null,
    enabled: !!currentUserId
  })

  // 사용자 게시물 쿼리
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', currentUserId],
    queryFn: getPosts,
    select: (data) => data?.filter((post: any) => post.userId === currentUserId),
    enabled: !!currentUserId
  })

  // 사용자 데이터 설정
  useEffect(() => {
    if (userData) {
      setUserDisplayName(userData.displayName || 'User Name')
      setUserUsername('@' + (userData.username || 'username'))
      setUserBio(userData.bio || '')
      setUserLocation(userData.location || '')
      setUserWebsite(userData.website || '')
      setUserJoinDate(new Date(userData.createdAt))
      setUserProfileImage(userData.photoURL || '')
    }
  }, [userData])

  const isLoading = userLoading || postsLoading

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* 프로필 헤더 */}
          <div className="space-y-4">
            {/* 커버 이미지 */}
            <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg overflow-hidden" />
            
            {/* 프로필 정보 */}
            <div className="relative px-4">
              <div className="absolute -top-16 left-4 w-24 h-24 rounded-full bg-card overflow-hidden ring-4 ring-background">
                {userProfileImage ? (
                  <img 
                    src={userProfileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              <div className="mt-4 space-y-2">
                <h1 className="text-2xl font-bold">{userDisplayName}</h1>
                <p className="text-muted-foreground">{userUsername}</p>
                
                {userBio && <p className="mt-2">{userBio}</p>}
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-3">
                  {userLocation && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{userLocation}</span>
                    </div>
                  )}
                  
                  {userWebsite && (
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      <a href={userWebsite} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                        {userWebsite.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>Joined {userJoinDate.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">125</span>
                    <span className="text-muted-foreground">Following</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">348</span>
                    <span className="text-muted-foreground">Followers</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* 탭 내비게이션 */}
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="likes">Likes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Posts</h2>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post: any) => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            {userProfileImage ? (
                              <img 
                                src={userProfileImage} 
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{userDisplayName}</p>
                            <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="whitespace-pre-wrap">{post.content}</p>
                        {post.imageUrl && (
                          <div className="mt-3 rounded-md overflow-hidden">
                            <img 
                              src={post.imageUrl} 
                              alt="Post image" 
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-lg">
                    <p className="text-muted-foreground">No posts yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="media" className="space-y-4 mt-4">
                <h2 className="text-xl font-semibold">Media</h2>
                <div className="text-center py-10 border rounded-lg">
                  <p className="text-muted-foreground">No media yet.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="likes" className="space-y-4 mt-4">
                <h2 className="text-xl font-semibold">Likes</h2>
                <div className="text-center py-10 border rounded-lg">
                  <p className="text-muted-foreground">No liked posts yet.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  )
}
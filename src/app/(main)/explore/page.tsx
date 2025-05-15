'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, Loader } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { getPosts } from '@/lib/firebase'

export default function ExplorePage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  })

  // 포스트 필터링 함수
  const filteredPosts = posts 
    ? posts.filter((post: any) => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  // 트렌딩 주제 (예시)
  const trendingTopics = [
    { name: '#Technology', postCount: 1240 },
    { name: '#Travel', postCount: 836 },
    { name: '#Food', postCount: 752 },
    { name: '#Photography', postCount: 624 },
    { name: '#Art', postCount: 512 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Explore</h1>
      
      {/* 검색 필드 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search posts, people, or tags" 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Trending Posts</h2>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No posts found.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.slice(0, 5).map((post: any) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="font-semibold text-sm">{post.userId?.substring(0, 2) || 'UN'}</span>
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">User ID: {post.userId}</CardTitle>
                          <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
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
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
              <Card>
                <CardContent className="p-4">
                  <ul className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span className="font-medium text-blue-500 hover:underline cursor-pointer">
                          {topic.name}
                        </span>
                        <span className="text-sm text-muted-foreground">{topic.postCount} posts</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="latest" className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">Latest Posts</h2>
          {/* Latest posts content would go here */}
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Latest posts will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="people" className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">People to Follow</h2>
          {/* People content would go here */}
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Suggested users will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
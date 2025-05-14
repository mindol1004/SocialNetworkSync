'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPosts, getCurrentUser, getUserById } from '@/lib/firebase'
import MainLayout from '@/components/layout/MainLayout'

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
  const router = useRouter()
  const [posts, setPosts] = useState<PostWithUser[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts() as any[]
        
        // Fetch user data for each post
        const postsWithUser = await Promise.all(
          postsData.map(async (post) => {
            const userData = await getUserById(post.userId)
            return {
              ...post,
              user: {
                displayName: userData?.displayName || 'Unknown User',
                photoURL: userData?.photoURL || '',
                username: userData?.username || 'unknown',
              }
            }
          })
        )
        
        setPosts(postsWithUser)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [router])
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </MainLayout>
    )
  }
  
  return (
    <MainLayout>
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Home</h1>
        
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">No posts yet. Follow some users or create your first post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <img 
                      src={post.user.photoURL || '/images/default-avatar.png'} 
                      alt={post.user.displayName} 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <div className="font-semibold">{post.user.displayName}</div>
                      <div className="text-sm text-gray-500">@{post.user.username}</div>
                    </div>
                  </div>
                  
                  <p className="mt-2 mb-3">{post.content}</p>
                  
                  {post.imageUrl && (
                    <div className="mt-3 mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt="Post content" 
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center mt-4 text-gray-500 space-x-4">
                    <button className="flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{Object.keys(post.likes || {}).length}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{Object.keys(post.comments || {}).length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
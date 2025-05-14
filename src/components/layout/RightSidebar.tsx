'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getDatabase, ref, get } from 'firebase/database'
import { followUser, getCurrentUser } from '@/lib/firebase'

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
  const router = useRouter()
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = getCurrentUser()
        if (!currentUser) return
        
        const db = getDatabase()
        
        // Fetch trending topics
        const topicsRef = ref(db, 'trending_topics')
        const topicsSnapshot = await get(topicsRef)
        
        if (topicsSnapshot.exists()) {
          setTrendingTopics(Object.values(topicsSnapshot.val()))
        } else {
          // Mock data if no trending topics
          setTrendingTopics([
            { name: 'MacbookPro', category: 'Technology', postCount: 2543 },
            { name: 'WWDC23', category: 'Technology', postCount: 1832 },
            { name: 'SwiftUI', category: 'Programming', postCount: 1253 },
            { name: 'minimalism', category: 'Lifestyle', postCount: 983 },
            { name: 'appleEvent', category: 'Technology', postCount: 872 },
          ])
        }
        
        // Fetch suggested users
        const usersRef = ref(db, 'users')
        const usersSnapshot = await get(usersRef)
        
        if (usersSnapshot.exists()) {
          const users = Object.values(usersSnapshot.val()) as any[]
          // Filter out current user
          const filteredUsers = users.filter(user => user.uid !== currentUser.uid)
          // Get 5 random users
          const randomUsers = filteredUsers
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
          
          setSuggestedUsers(randomUsers)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data for right sidebar:', error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const handleFollow = async (userId: string) => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser?.uid) return
      
      await followUser(currentUser.uid, userId)
      
      // Update UI
      setSuggestedUsers(prev => 
        prev.filter(user => user.uid !== userId)
      )
    } catch (error) {
      console.error('Error following user:', error)
    }
  }
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      {/* Trending topics */}
      <div>
        <h3 className="font-bold text-xl mb-4">Trending Topics</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {trendingTopics.map((topic, index) => (
            <div 
              key={index} 
              className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              onClick={() => router.push(`/explore?topic=${topic.name}`)}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">{topic.category}</div>
              <div className="font-semibold">#{topic.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{topic.postCount.toLocaleString()} posts</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Who to follow */}
      <div>
        <h3 className="font-bold text-xl mb-4">Who to follow</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {suggestedUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No suggestions available right now
            </div>
          ) : (
            suggestedUsers.map((user) => (
              <div key={user.uid} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center justify-between">
                  <Link href={`/profile/${user.username}`} className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold">
                          {user.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{user.displayName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</div>
                      {user.profession && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.profession}</div>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleFollow(user.uid)}
                    className="ml-2 px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
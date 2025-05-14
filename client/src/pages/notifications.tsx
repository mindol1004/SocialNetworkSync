import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getDatabase, ref, onValue, off, query, orderByChild, get } from "firebase/database";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/lib/i18n";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message';
  senderId: string;
  recipientId: string;
  objectId?: string; // post id, comment id, etc.
  read: boolean;
  createdAt: number;
  // Populated fields
  sender?: {
    displayName: string;
    photoURL: string;
    username: string;
  };
  text?: string;
}

export default function Notifications() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [_, setLocation] = useLocation();
  const database = getDatabase();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const notificationsRef = ref(database, 'notifications');
    const userNotificationsQuery = query(
      notificationsRef, 
      orderByChild('recipientId'), 
      // @ts-ignore - Firebase API expects this structure
      // eslint-disable-next-line
      ...[user.uid]
    );
    
    const unsubscribe = onValue(userNotificationsQuery, async (snapshot) => {
      if (!snapshot.exists()) {
        setNotifications([]);
        setLoading(false);
        return;
      }
      
      try {
        const notificationsData = snapshot.val();
        const notificationsArray: Notification[] = [];
        
        // Process each notification and fetch sender details
        for (const id in notificationsData) {
          const notification = notificationsData[id];
          
          // Skip if not for this user
          if (notification.recipientId !== user.uid) continue;
          
          // Get sender details
          const senderRef = ref(database, `users/${notification.senderId}`);
          const senderSnapshot = await get(senderRef);
          let sender = null;
          
          if (senderSnapshot.exists()) {
            const senderData = senderSnapshot.val();
            sender = {
              displayName: senderData.displayName,
              photoURL: senderData.photoURL,
              username: senderData.username
            };
          }
          
          // Build notification text based on type
          let text = "";
          switch (notification.type) {
            case 'like':
              text = "liked your post";
              break;
            case 'comment':
              text = "commented on your post";
              break;
            case 'follow':
              text = "started following you";
              break;
            case 'mention':
              text = "mentioned you in a post";
              break;
            case 'message':
              text = "sent you a message";
              break;
          }
          
          notificationsArray.push({
            id,
            ...notification,
            sender,
            text
          });
        }
        
        // Sort by createdAt descending
        notificationsArray.sort((a, b) => b.createdAt - a.createdAt);
        
        setNotifications(notificationsArray);
        setLoading(false);
      } catch (error) {
        console.error("Error processing notifications:", error);
        setLoading(false);
      }
    });
    
    return () => {
      off(userNotificationsQuery);
    };
  }, [user, database]);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <span className="material-icons text-red-500">favorite</span>;
      case 'comment':
        return <span className="material-icons text-green-500">chat_bubble</span>;
      case 'follow':
        return <span className="material-icons text-blue-500">person_add</span>;
      case 'mention':
        return <span className="material-icons text-purple-500">alternate_email</span>;
      case 'message':
        return <span className="material-icons text-yellow-500">mail</span>;
      default:
        return <span className="material-icons text-neutral-500">notifications</span>;
    }
  };
  
  const getNotificationTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === 'follow') {
      // Navigate to user profile
      setLocation(`/profile/${notification.sender?.username}`);
    } else if (notification.type === 'message') {
      // Navigate to messages
      setLocation('/messages');
    } else if (notification.objectId) {
      // Navigate to post
      // In a real app, this would navigate to the specific post
      setLocation('/');
    }
  };
  
  const filteredNotifications = (filter: string) => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  };
  
  return (
    <MainLayout>
      <div className="flex-1 py-6 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t('notifications')}</h1>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="like">Likes</TabsTrigger>
              <TabsTrigger value="comment">Comments</TabsTrigger>
              <TabsTrigger value="follow">Follows</TabsTrigger>
              <TabsTrigger value="mention">Mentions</TabsTrigger>
            </TabsList>
            
            {['all', 'like', 'comment', 'follow', 'mention'].map(filter => (
              <TabsContent key={filter} value={filter} className="mt-0">
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[70vh]">
                      {loading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : filteredNotifications(filter).length > 0 ? (
                        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                          {filteredNotifications(filter).map(notification => (
                            <div 
                              key={notification.id}
                              className={`p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer ${
                                !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mr-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={notification.sender?.photoURL} alt={notification.sender?.displayName} />
                                    <AvatarFallback>{notification.sender?.displayName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm">
                                    <span className="font-medium">{notification.sender?.displayName}</span>
                                    {' '}
                                    {notification.text}
                                  </p>
                                  <p className="text-xs text-neutral-500 mt-1">
                                    {getNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                                <div className="ml-4 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-full">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <span className="material-icons text-4xl text-neutral-300 dark:text-neutral-700 mb-2">
                            notifications_none
                          </span>
                          <p className="text-neutral-500">No notifications yet</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}

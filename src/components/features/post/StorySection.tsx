import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDatabase, ref, get } from "firebase/database";
import { useAuthStore } from "@/store/authStore";

interface StoryUser {
  uid: string;
  displayName: string;
  username: string;
  photoURL: string;
}

export default function StorySection() {
  const { user } = useAuthStore();
  const [storyUsers, setStoryUsers] = useState<StoryUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        const database = getDatabase();
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const storyUsersArray: StoryUser[] = [];
          
          for (const uid in usersData) {
            // Skip current user
            if (uid === user.uid) continue;
            
            const userData = usersData[uid];
            storyUsersArray.push({
              uid,
              displayName: userData.displayName,
              username: userData.username,
              photoURL: userData.photoURL
            });
            
            // Limit to 5 users
            if (storyUsersArray.length >= 5) break;
          }
          
          setStoryUsers(storyUsersArray);
        }
      } catch (error) {
        console.error("Error fetching story users:", error);
      }
    };
    
    fetchUsers();
  }, [user]);

  // If no users, don't render the component
  if (storyUsers.length === 0) return null;

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-4 pb-2">
        {storyUsers.map((storyUser) => (
          <div key={storyUser.uid} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
              <div className="bg-white dark:bg-neutral-900 p-0.5 rounded-full h-full w-full">
                <Avatar className="w-full h-full">
                  <AvatarImage 
                    src={storyUser.photoURL} 
                    alt={storyUser.displayName} 
                    className="w-full h-full object-cover rounded-full"
                  />
                  <AvatarFallback className="rounded-full">
                    {storyUser.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-xs mt-1">{storyUser.displayName.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

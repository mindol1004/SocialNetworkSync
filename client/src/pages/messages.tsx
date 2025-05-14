import { useEffect, useState, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { getDatabase, ref, push, onValue, off, get, set, query, orderByChild, startAt, endAt } from "firebase/database";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: number;
  participantDetails: {
    [key: string]: {
      displayName: string;
      photoURL: string;
      username: string;
    }
  };
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export default function Messages() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const database = getDatabase();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!user) return;
    
    // Listen for conversations
    const conversationsRef = ref(database, `conversations`);
    
    const unsubscribe = onValue(conversationsRef, async (snapshot) => {
      if (!snapshot.exists()) return;
      
      const conversationsData = snapshot.val();
      const conversationsArray: Conversation[] = [];
      
      // Process each conversation
      for (const id in conversationsData) {
        const conversation = conversationsData[id];
        
        // Only include conversations that the current user is part of
        if (conversation.participants.includes(user.uid)) {
          // Get the other participant's details
          const participantDetails: any = {};
          
          for (const participantId of conversation.participants) {
            if (participantId !== user.uid) {
              // Get user details from database
              const userRef = ref(database, `users/${participantId}`);
              const userSnapshot = await get(userRef);
              
              if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                participantDetails[participantId] = {
                  displayName: userData.displayName,
                  photoURL: userData.photoURL,
                  username: userData.username
                };
              }
            }
          }
          
          conversationsArray.push({
            id,
            ...conversation,
            participantDetails
          });
        }
      }
      
      // Sort by most recent message
      conversationsArray.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
      
      setConversations(conversationsArray);
      
      // If no active conversation and we have conversations, set the first one active
      if (!activeConversation && conversationsArray.length > 0) {
        setActiveConversation(conversationsArray[0]);
      }
    });
    
    return () => {
      off(conversationsRef);
    };
  }, [user, database, activeConversation]);
  
  useEffect(() => {
    if (!activeConversation) return;
    
    // Listen for messages in the active conversation
    const messagesRef = ref(database, `messages/${activeConversation.id}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (!snapshot.exists()) return;
      
      const messagesData = snapshot.val();
      const messagesArray: Message[] = [];
      
      for (const id in messagesData) {
        messagesArray.push({
          id,
          ...messagesData[id]
        });
      }
      
      // Sort by timestamp
      messagesArray.sort((a, b) => a.timestamp - b.timestamp);
      
      setMessages(messagesArray);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    
    return () => {
      off(messagesRef);
    };
  }, [activeConversation, database]);
  
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2 || !user) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    const searchUsers = async () => {
      try {
        // Search for users whose displayName or username contains the search term
        const usersRef = ref(database, 'users');
        const usersSnapshot = await get(usersRef);
        
        if (!usersSnapshot.exists()) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }
        
        const usersData = usersSnapshot.val();
        const results = [];
        
        for (const id in usersData) {
          const userData = usersData[id];
          
          // Skip the current user
          if (id === user.uid) continue;
          
          const displayNameMatch = userData.displayName.toLowerCase().includes(searchTerm.toLowerCase());
          const usernameMatch = userData.username.toLowerCase().includes(searchTerm.toLowerCase());
          
          if (displayNameMatch || usernameMatch) {
            results.push({
              uid: id,
              displayName: userData.displayName,
              username: userData.username,
              photoURL: userData.photoURL
            });
          }
        }
        
        setSearchResults(results);
        setIsSearching(false);
      } catch (error) {
        console.error("Error searching users:", error);
        setIsSearching(false);
      }
    };
    
    const timeout = setTimeout(searchUsers, 500);
    
    return () => clearTimeout(timeout);
  }, [searchTerm, user, database]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user) return;
    
    try {
      const message = {
        senderId: user.uid,
        text: newMessage,
        timestamp: Date.now()
      };
      
      // Add message to the conversation
      const messagesRef = ref(database, `messages/${activeConversation.id}`);
      await push(messagesRef, message);
      
      // Update last message in conversation
      const conversationRef = ref(database, `conversations/${activeConversation.id}`);
      await set(conversationRef, {
        ...activeConversation,
        lastMessage: newMessage,
        lastMessageTime: Date.now()
      });
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const startNewConversation = async (selectedUser: any) => {
    if (!user) return;
    
    try {
      // Check if a conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.participants.includes(selectedUser.uid)
      );
      
      if (existingConversation) {
        setActiveConversation(existingConversation);
        setSearchTerm("");
        setSearchResults([]);
        return;
      }
      
      // Create a new conversation
      const newConversation = {
        participants: [user.uid, selectedUser.uid],
        lastMessage: "",
        lastMessageTime: Date.now()
      };
      
      const conversationsRef = ref(database, 'conversations');
      const newConversationRef = await push(conversationsRef, newConversation);
      
      const conversationWithDetails = {
        ...newConversation,
        id: newConversationRef.key!,
        participantDetails: {
          [selectedUser.uid]: {
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
            username: selectedUser.username
          }
        }
      };
      
      setActiveConversation(conversationWithDetails as Conversation);
      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };
  
  const getOtherParticipant = (conversation: Conversation) => {
    if (!user || !conversation.participantDetails) return null;
    
    const otherParticipantId = conversation.participants.find(id => id !== user.uid);
    if (!otherParticipantId) return null;
    
    return conversation.participantDetails[otherParticipantId];
  };
  
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), 'HH:mm');
  };
  
  return (
    <MainLayout>
      <div className="flex-1 flex h-full overflow-hidden">
        <div className="border-r border-neutral-200 dark:border-neutral-800 w-80 flex flex-col">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="font-semibold text-lg mb-2">{t('messages')}</h2>
            <div className="relative">
              <Input
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-100 dark:bg-neutral-800 border-none rounded-full py-2"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <span className="material-icons text-sm">search</span>
              </span>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {searchTerm && (
              <div className="p-2">
                <h3 className="text-sm font-medium text-neutral-500 px-2 py-1">Search Results</h3>
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin h-4 w-4 border-b-2 border-primary rounded-full"></div>
                  </div>
                ) : (
                  searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map(user => (
                        <div 
                          key={user.uid}
                          onClick={() => startNewConversation(user)}
                          className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                            <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.displayName}</div>
                            <div className="text-xs text-neutral-500">@{user.username}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-neutral-500">No users found</div>
                  )
                )}
              </div>
            )}
            
            {!searchTerm && (
              <div className="space-y-1 p-2">
                {conversations.length === 0 ? (
                  <div className="text-center py-6 text-neutral-500">
                    <p className="mb-2">No conversations yet</p>
                    <p className="text-sm">Search for users to start chatting</p>
                  </div>
                ) : (
                  conversations.map(conversation => {
                    const otherParticipant = getOtherParticipant(conversation);
                    if (!otherParticipant) return null;
                    
                    return (
                      <div 
                        key={conversation.id}
                        onClick={() => setActiveConversation(conversation)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${
                          activeConversation?.id === conversation.id 
                            ? 'bg-blue-50 dark:bg-blue-900/20' 
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <Avatar className="h-12 w-12 mr-3">
                          <AvatarImage src={otherParticipant.photoURL} alt={otherParticipant.displayName} />
                          <AvatarFallback>{otherParticipant.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{otherParticipant.displayName}</div>
                          {conversation.lastMessage && (
                            <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                              {conversation.lastMessage}
                            </div>
                          )}
                        </div>
                        {conversation.lastMessageTime && (
                          <div className="text-xs text-neutral-500 ml-2">
                            {format(new Date(conversation.lastMessageTime), 'HH:mm')}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </ScrollArea>
        </div>
        
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center">
                {(() => {
                  const otherParticipant = getOtherParticipant(activeConversation);
                  if (!otherParticipant) return null;
                  
                  return (
                    <>
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={otherParticipant.photoURL} alt={otherParticipant.displayName} />
                        <AvatarFallback>{otherParticipant.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{otherParticipant.displayName}</div>
                        <div className="text-xs text-neutral-500">@{otherParticipant.username}</div>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map(message => {
                      const isCurrentUser = message.senderId === user?.uid;
                      
                      return (
                        <div 
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                              isCurrentUser 
                                ? 'bg-primary text-white' 
                                : 'bg-neutral-100 dark:bg-neutral-800'
                            }`}
                          >
                            <p>{message.text}</p>
                            <div 
                              className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-blue-100' : 'text-neutral-500'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center">
                <Input
                  type="text"
                  placeholder={t('postComment')}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="bg-neutral-100 dark:bg-neutral-800 border-none rounded-full py-2.5 px-4"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="ml-2 text-primary hover:text-primary-dark"
                  variant="ghost"
                  size="icon"
                  disabled={!newMessage.trim()}
                >
                  <span className="material-icons">send</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="material-icons text-5xl text-neutral-300 dark:text-neutral-700 mb-4">chat</span>
              <h3 className="text-xl font-medium mb-2">Your Messages</h3>
              <p className="text-neutral-500 max-w-sm mb-4">
                Send private messages to friends and connections
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-full"
                onClick={() => setSearchTerm(" ")} // Trigger search mode with a space
              >
                Start Messaging
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "@/lib/i18n";
import { toggleLikePost, addComment } from "@/lib/firebase";
import { User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: number;
  user?: {
    displayName: string;
    photoURL: string;
    username: string;
  };
}

interface PostProps {
  post: {
    id: string;
    content: string;
    imageUrl?: string;
    createdAt: number;
    userId: string;
    likes: Record<string, boolean>;
    comments: Record<string, Comment>;
    user: {
      displayName: string;
      photoURL: string;
      username: string;
    };
  };
  currentUser: User | null;
}

export default function PostCard({ post, currentUser }: PostProps) {
  const [_, setLocation] = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(currentUser ? !!post.likes?.[currentUser.uid] : false);
  const [likeCount, setLikeCount] = useState(post.likes ? Object.keys(post.likes).length : 0);
  const [commentCount, setCommentCount] = useState(post.comments ? Object.keys(post.comments).length : 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  // Calculate comment data
  const comments = post.comments 
    ? Object.keys(post.comments).map(key => ({
        id: key,
        ...post.comments[key]
      }))
    : [];

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const isLongContent = post.content.length > 300;
  const displayContent = isLongContent && !showFullContent 
    ? post.content.substring(0, 300) + "..." 
    : post.content;

  const toggleComments = () => {
    setIsCommentsVisible(!isCommentsVisible);
  };

  const handleLike = async () => {
    if (!currentUser) {
      setLocation('/login');
      return;
    }

    try {
      const newLikeStatus = await toggleLikePost(post.id, currentUser.uid);

      // Update UI
      setLiked(newLikeStatus);
      setLikeCount(prevCount => newLikeStatus ? prevCount + 1 : prevCount - 1);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // In a real app, save to user's bookmarks in database
  };

  const handleAddComment = async () => {
    if (!currentUser) {
      setLocation('/login');
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmittingComment(true);

    try {
      await addComment(post.id, currentUser.uid, newComment);

      // Clear input
      setNewComment("");

      // Update comment count
      setCommentCount(prevCount => prevCount + 1);

      // Make sure comments are visible
      setIsCommentsVisible(true);

      // In a real app, we would fetch the updated comments
      // Here we're just showing what the user entered
      toast({
        title: "Success",
        description: "Comment added successfully"
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const navigateToProfile = (username: string) => {
    setLocation(`/profile/${username}`);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow mb-6 animate-fade-in">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigateToProfile(post.user.username)}
          >
            <Avatar className="w-10 h-10 mr-3">
              <AvatarImage src={post.user.photoURL} alt={post.user.displayName} />
              <AvatarFallback>{post.user.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.user.displayName}</p>
              <p className="text-xs text-neutral-500">{formattedDate}</p>
            </div>
          </div>
          <button className="text-neutral-400">
            <span className="material-icons">more_horiz</span>
          </button>
        </div>

        <div className="mt-3">
          <p>
            {displayContent}
            {isLongContent && (
              <button 
                className="text-primary ml-1 text-sm"
                onClick={() => setShowFullContent(!showFullContent)}
              >
                {showFullContent ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </div>

        {post.imageUrl && (
          <div className="mt-3 rounded-xl overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex">
            <button 
              className={`flex items-center ${
                liked 
                  ? 'text-red-500' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary'
              } mr-4 transition`}
              onClick={handleLike}
            >
              <span className="material-icons mr-1">
                {liked ? 'favorite' : 'favorite_border'}
              </span>
              <span>{likeCount}</span>
            </button>
            <button 
              className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary mr-4 transition"
              onClick={toggleComments}
            >
              <span className="material-icons mr-1">chat_bubble_outline</span>
              <span>{commentCount}</span>
            </button>
            <button className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition">
              <span className="material-icons mr-1">share</span>
              <span>0</span>
            </button>
          </div>
          <button 
            className={`text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition ${bookmarked ? 'text-primary' : ''}`}
            onClick={handleBookmark}
          >
            <span className="material-icons">
              {bookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>
      </div>

      {isCommentsVisible && (
        <div className="px-4 pb-4 pt-0 border-t border-neutral-100 dark:border-neutral-800">
          <div className="space-y-4 animate-slide-up">
            {comments.length > 0 ? (
              comments.map((comment: Comment) => (
                <div key={comment.id} className="flex">
                  <Avatar className="w-8 h-8 mr-3 mt-1">
                    <AvatarImage src={comment.user?.photoURL || ""} alt={comment.user?.displayName || ""} />
                    <AvatarFallback>{comment.user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-2.5 flex-1">
                    <p className="font-medium text-sm">{comment.user?.displayName || "User"}</p>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-500 py-2">No comments yet</p>
            )}

            <div className="flex items-center mt-4">
              <Avatar className="w-8 h-8 mr-3">
                <AvatarImage 
                  src={currentUser?.photoURL || ""} 
                  alt={currentUser?.displayName || "User"} 
                />
                <AvatarFallback>{currentUser?.displayName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <Input 
                type="text" 
                placeholder={t('postComment')}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="bg-neutral-100 dark:bg-neutral-800 border-none rounded-full py-2 px-4 flex-1 text-sm focus:outline-none"
              />
              <Button 
                className="ml-2 text-primary"
                variant="ghost"
                size="icon"
                onClick={handleAddComment}
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                ) : (
                  <span className="material-icons">send</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
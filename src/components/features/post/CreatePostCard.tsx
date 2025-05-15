import { useState, ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { createPost } from "@/lib/firebase";
import { User } from "firebase/auth";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CreatePostCardProps {
  user: User | null;
  onPostCreated: (postId: string) => void;
}

export default function CreatePostCard({ user, onPostCreated }: CreatePostCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  if (!user) return null;

  const handleContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const toggleImageInput = () => {
    setShowImageInput(!showImageInput);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const postId = await createPost(user.uid, content, imageUrl);

      // Clear form
      setContent("");
      setImageUrl("");
      setShowImageInput(false);

      // Notify parent
      onPostCreated(postId);

      toast({
        title: "Success",
        description: "Your post has been created"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow mb-6 animate-fade-in">

      <DialogContent>
        <DialogTitle className="text-lg font-semibold mb-4">
          Create New Post
        </DialogTitle>
        <div className="space-y-4">
        <div className="flex items-center">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarImage src={user.photoURL || ""} alt="User avatar" />
            <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <Input 
            type="text" 
            placeholder={t('whatsOnYourMind')}
            value={content}
            onChange={handleContentChange}
            className="bg-neutral-100 dark:bg-neutral-800 border-none rounded-full py-2.5 px-4 flex-1 text-sm focus:outline-none"
          />
        </div>

        {showImageInput && (
          <div className="mt-3">
            <Input 
              type="text" 
              placeholder="Image URL"
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg py-2 px-4 w-full text-sm focus:outline-none"
            />
          </div>
        )}

        <div className="flex justify-between mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex">
            <button 
              className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary mr-4"
              onClick={toggleImageInput}
            >
              <span className="material-icons mr-1 text-sm">image</span>
              <span className="text-sm">{t('photo')}</span>
            </button>
            <button className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary mr-4">
              <span className="material-icons mr-1 text-sm">videocam</span>
              <span className="text-sm">{t('video')}</span>
            </button>
            <button className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary">
              <span className="material-icons mr-1 text-sm">location_on</span>
              <span className="text-sm">{t('location')}</span>
            </button>
          </div>

          <Button 
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-1 text-sm"
            onClick={handleSubmit}
            disabled={isSubmitting || (!content.trim() && !imageUrl.trim())}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {t('loading')}
              </div>
            ) : t('newPost')}
          </Button>
        </div>
      </div>
        </div>
      </DialogContent>

    </div>

  );
}
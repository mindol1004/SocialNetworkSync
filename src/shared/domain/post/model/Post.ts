import { Likes } from '@/shared/domain/post/model/Likes';
import { Comments } from '@/shared/domain/post/model/Comments';

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  likes?: Record<string, Likes>;
  comments?: Record<string, Comments>;
  location?: string;
  tags?: string[];
  mentions?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

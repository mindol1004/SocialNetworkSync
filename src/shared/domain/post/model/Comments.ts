import { Likes } from '@/shared/domain/post/model/Likes';

export interface Comments {
  id: string;
  content: string;
  userId: string;
  postId: string;
  likes?: Record<string, Likes>;
  parentId?: string;
  createdAt: Date;
  updatedAt?: Date;
}
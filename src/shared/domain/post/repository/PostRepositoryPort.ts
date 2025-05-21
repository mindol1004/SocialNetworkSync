import { Post } from '@/shared/domain/post/model/Post';

export interface PostRepositoryPort {
  create(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  findByUserId(userId: string): Promise<Post[]>;
  update(post: Post): Promise<Post>;
  delete(id: string): Promise<void>;
  addLike(postId: string, userId: string): Promise<void>;
  removeLike(postId: string, userId: string): Promise<void>;
  addComment(postId: string, userId: string, content: string): Promise<void>;
  removeComment(postId: string, commentId: string): Promise<void>;
  findByTags(tags: string[]): Promise<Post[]>;
  findByLocation(location: string): Promise<Post[]>;
}
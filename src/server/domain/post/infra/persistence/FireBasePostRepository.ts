
import { Post } from '@/shared/domain/post/model/Post';
import { PostRepositoryPort } from '@/shared/domain/post/repository/PostRepositoryPort';
import { database } from '@/server/infra/db/firebase/firebase';
import { ref, get, set, push, remove, update } from 'firebase/database';

export const FireBasePostRepository: PostRepositoryPort = {
  async create(post: Post): Promise<Post> {
    const postsRef = ref(database, 'posts');
    const newPostRef = push(postsRef);
    const postWithId = { ...post, id: newPostRef.key! };

    await set(newPostRef, postWithId);
    return postWithId;
  },

  async findById(id: string): Promise<Post | null> {
    const postRef = ref(database, `posts/${id}`);
    const snapshot = await get(postRef);
    return snapshot.exists() ? snapshot.val() : null;
  },

  async findAll(): Promise<Post[]> {
    const postsRef = ref(database, 'posts');
    const snapshot = await get(postsRef);
    if (!snapshot.exists()) return [];

    const posts = snapshot.val();
    return Object.values(posts);
  },

  async findByUserId(userId: string): Promise<Post[]> {
    const postsRef = ref(database, 'posts');
    const snapshot = await get(postsRef);
    if (!snapshot.exists()) return [];

    const posts = Object.values(snapshot.val()) as Post[];
    return posts.filter((post) => post.userId === userId);
  },

  async update(post: Post): Promise<Post> {
    const postRef = ref(database, `posts/${post.id}`);
    await update(postRef, post);
    return post;
  },

  async delete(id: string): Promise<void> {
    const postRef = ref(database, `posts/${id}`);
    await remove(postRef);
  },

  async addLike(postId: string, userId: string): Promise<void> {
    const likeRef = ref(database, `posts/${postId}/likes/${userId}`);
    await set(likeRef, true);
  },

  async removeLike(postId: string, userId: string): Promise<void> {
    const likeRef = ref(database, `posts/${postId}/likes/${userId}`);
    await remove(likeRef);
  },

  async addComment(postId: string, userId: string, content: string): Promise<void> {
    const commentsRef = ref(database, `posts/${postId}/comments`);
    const newCommentRef = push(commentsRef);
    await set(newCommentRef, {
      userId,
      content,
      createdAt: new Date().toISOString()
    });
  },

  async removeComment(postId: string, commentId: string): Promise<void> {
    const commentRef = ref(database, `posts/${postId}/comments/${commentId}`);
    await remove(commentRef);
  },

  async findByTags(tags: string[]): Promise<Post[]> {
    const posts = await this.findAll();
    return posts.filter(post => 
      post.tags?.some(tag => tags.includes(tag))
    );
  },

  async findByLocation(location: string): Promise<Post[]> {
    const posts = await this.findAll();
    return posts.filter(post => 
      post.location?.toLowerCase() === location.toLowerCase()
    );
  }
};

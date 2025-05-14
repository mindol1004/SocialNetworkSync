import { create } from 'zustand';

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
  userId: string;
  likes: Record<string, boolean>;
  comments: Record<string, any>;
  user?: {
    displayName: string;
    photoURL: string;
    username: string;
  };
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPosts: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  loading: false,
  error: null,
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (postId, updates) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...updates } : post
      ),
    })),
  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearPosts: () => set({ posts: [] }),
}));

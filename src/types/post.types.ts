export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  createdAt: number;
  updatedAt?: number;
  likes: Record<string, boolean>;
  comments: Record<string, Comment>;
  location?: string;
  tags?: string[];
  mentions?: string[];
}

export interface PostWithUser extends Post {
  user: {
    displayName: string;
    photoURL: string;
    username: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: number;
  updatedAt?: number;
  likes?: Record<string, boolean>;
  parentId?: string;
}

export interface CommentWithUser extends Comment {
  user: {
    displayName: string;
    photoURL: string;
    username: string;
  };
}

export interface CreatePostData {
  content: string;
  imageUrl?: string;
  location?: string;
  tags?: string[];
  mentions?: string[];
}

export interface TrendingTopic {
  name: string;
  category: string;
  postCount: number;
}
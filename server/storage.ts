import { 
  User, InsertUser, 
  Post, InsertPost,
  Like, InsertLike,
  Comment, InsertComment,
  Follow, InsertFollow,
  users, posts, likes, comments, follows
} from "@shared/schema";

// Storage interface with all CRUD methods needed for the app
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post methods
  getPost(id: number): Promise<Post | undefined>;
  getAllPosts(): Promise<Post[]>;
  getUserPosts(userId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Like methods
  getLikes(postId: number): Promise<Like[]>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(postId: number, userId: string): Promise<boolean>;
  
  // Comment methods
  getComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Follow methods
  getFollowers(userId: string): Promise<Follow[]>;
  getFollowing(userId: string): Promise<Follow[]>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: string, followingId: string): Promise<boolean>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private likes: Map<number, Like>;
  private comments: Map<number, Comment>;
  private follows: Map<number, Follow>;
  
  private userId: number;
  private postId: number;
  private likeId: number;
  private commentId: number;
  private followId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.likes = new Map();
    this.comments = new Map();
    this.follows = new Map();
    
    this.userId = 1;
    this.postId = 1;
    this.likeId = 1;
    this.commentId = 1;
    this.followId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Post methods
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postId++;
    const createdAt = new Date();
    const post: Post = { ...insertPost, id, createdAt };
    this.posts.set(id, post);
    return post;
  }

  // Like methods
  async getLikes(postId: number): Promise<Like[]> {
    return Array.from(this.likes.values())
      .filter(like => like.postId === postId);
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const id = this.likeId++;
    const createdAt = new Date();
    const like: Like = { ...insertLike, id, createdAt };
    this.likes.set(id, like);
    return like;
  }

  async deleteLike(postId: number, userId: string): Promise<boolean> {
    const like = Array.from(this.likes.values()).find(
      like => like.postId === postId && like.userId === userId
    );
    
    if (!like) return false;
    
    return this.likes.delete(like.id);
  }

  // Comment methods
  async getComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const createdAt = new Date();
    const comment: Comment = { ...insertComment, id, createdAt };
    this.comments.set(id, comment);
    return comment;
  }

  // Follow methods
  async getFollowers(userId: string): Promise<Follow[]> {
    return Array.from(this.follows.values())
      .filter(follow => follow.followingId === userId);
  }

  async getFollowing(userId: string): Promise<Follow[]> {
    return Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId);
  }

  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    const id = this.followId++;
    const createdAt = new Date();
    const follow: Follow = { ...insertFollow, id, createdAt };
    this.follows.set(id, follow);
    return follow;
  }

  async deleteFollow(followerId: string, followingId: string): Promise<boolean> {
    const follow = Array.from(this.follows.values()).find(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
    
    if (!follow) return false;
    
    return this.follows.delete(follow.id);
  }
}

export const storage = new MemStorage();

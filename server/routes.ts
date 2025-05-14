import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertPostSchema, 
  insertLikeSchema, 
  insertCommentSchema, 
  insertFollowSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:username", async (req, res) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid user data", errors: validation.error.errors });
      }
      
      const user = await storage.createUser(validation.data);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  // Post routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      return res.json(posts);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      return res.json(post);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const validation = insertPostSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid post data", errors: validation.error.errors });
      }
      
      const post = await storage.createPost(validation.data);
      return res.status(201).json(post);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  // Like routes
  app.post("/api/likes", async (req, res) => {
    try {
      const validation = insertLikeSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid like data", errors: validation.error.errors });
      }
      
      const like = await storage.createLike(validation.data);
      return res.status(201).json(like);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.delete("/api/likes", async (req, res) => {
    try {
      const schema = z.object({
        postId: z.number(),
        userId: z.string()
      });
      
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.errors });
      }
      
      const { postId, userId } = validation.data;
      const result = await storage.deleteLike(postId, userId);
      
      return res.json({ success: result });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  // Comment routes
  app.post("/api/comments", async (req, res) => {
    try {
      const validation = insertCommentSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid comment data", errors: validation.error.errors });
      }
      
      const comment = await storage.createComment(validation.data);
      return res.status(201).json(comment);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  // Follow routes
  app.post("/api/follows", async (req, res) => {
    try {
      const validation = insertFollowSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid follow data", errors: validation.error.errors });
      }
      
      const follow = await storage.createFollow(validation.data);
      return res.status(201).json(follow);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.delete("/api/follows", async (req, res) => {
    try {
      const schema = z.object({
        followerId: z.string(),
        followingId: z.string()
      });
      
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.errors });
      }
      
      const { followerId, followingId } = validation.data;
      const result = await storage.deleteFollow(followerId, followingId);
      
      return res.json({ success: result });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

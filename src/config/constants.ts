// App constants
export const APP_NAME = 'MiniMeet';
export const APP_DESCRIPTION = 'A minimalist social networking platform';

// Firebase collection names
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  FOLLOWERS: 'followers',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// Upload limits (in bytes)
export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_POST_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Supported image types
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Date formats
export const DATE_FORMAT = {
  FULL: 'MMMM d, yyyy',
  SHORT: 'MMM d, yyyy',
  TIME: 'h:mm a',
  DATETIME: 'MMM d, yyyy h:mm a',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  POSTS: '/api/posts',
  COMMENTS: '/api/comments',
  MESSAGES: '/api/messages',
  NOTIFICATIONS: '/api/notifications',
};
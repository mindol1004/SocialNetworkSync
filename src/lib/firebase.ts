import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, get, push, update, remove, onValue, off, query, orderByChild, equalTo } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  appId: process.env.FIREBASE_APP_ID,
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in database, if not create profile
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      await set(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        username: user.email?.split('@')[0] || `user_${Math.floor(Math.random() * 1000000)}`,
        bio: '',
        createdAt: Date.now(),
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email: ", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update profile
    await updateProfile(user, { displayName });
    
    // Create user in database
    const username = email.split('@')[0];
    await set(ref(database, `users/${user.uid}`), {
      uid: user.uid,
      displayName,
      email,
      photoURL: '',
      username,
      bio: '',
      createdAt: Date.now(),
    });
    
    return user;
  } catch (error) {
    console.error("Error registering with email: ", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Database functions
export const createPost = async (userId: string, content: string, imageUrl?: string) => {
  try {
    const postRef = ref(database, 'posts');
    const newPostRef = push(postRef);
    
    await set(newPostRef, {
      id: newPostRef.key,
      userId,
      content,
      imageUrl: imageUrl || '',
      createdAt: Date.now(),
      likes: {},
      comments: {}
    });
    
    return newPostRef.key;
  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const postsRef = ref(database, 'posts');
    const snapshot = await get(postsRef);
    
    if (snapshot.exists()) {
      const postsData = snapshot.val();
      // Convert to array and sort by createdAt descending
      return Object.values(postsData).sort((a: any, b: any) => b.createdAt - a.createdAt);
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const usersRef = ref(database, 'users');
    const userQuery = query(usersRef, orderByChild('username'), equalTo(username));
    const snapshot = await get(userQuery);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      return Object.values(users)[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user by username: ", error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user by ID: ", error);
    throw error;
  }
};

export const toggleLikePost = async (postId: string, userId: string) => {
  try {
    const likeRef = ref(database, `posts/${postId}/likes/${userId}`);
    const snapshot = await get(likeRef);
    
    if (snapshot.exists()) {
      // Unlike
      await remove(likeRef);
      return false;
    } else {
      // Like
      await set(likeRef, true);
      return true;
    }
  } catch (error) {
    console.error("Error toggling like: ", error);
    throw error;
  }
};

export const addComment = async (postId: string, userId: string, content: string) => {
  try {
    const commentRef = ref(database, `posts/${postId}/comments`);
    const newCommentRef = push(commentRef);
    
    await set(newCommentRef, {
      id: newCommentRef.key,
      userId,
      content,
      createdAt: Date.now()
    });
    
    return newCommentRef.key;
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};

export const followUser = async (currentUserId: string, targetUserId: string) => {
  try {
    // Add to current user's following
    await set(ref(database, `users/${currentUserId}/following/${targetUserId}`), true);
    
    // Add to target user's followers
    await set(ref(database, `users/${targetUserId}/followers/${currentUserId}`), true);
    
    return true;
  } catch (error) {
    console.error("Error following user: ", error);
    throw error;
  }
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  try {
    // Remove from current user's following
    await remove(ref(database, `users/${currentUserId}/following/${targetUserId}`));
    
    // Remove from target user's followers
    await remove(ref(database, `users/${targetUserId}/followers/${currentUserId}`));
    
    return true;
  } catch (error) {
    console.error("Error unfollowing user: ", error);
    throw error;
  }
};

export const getFollowStatus = async (currentUserId: string, targetUserId: string) => {
  try {
    const followRef = ref(database, `users/${currentUserId}/following/${targetUserId}`);
    const snapshot = await get(followRef);
    
    return snapshot.exists();
  } catch (error) {
    console.error("Error checking follow status: ", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export { auth, database };

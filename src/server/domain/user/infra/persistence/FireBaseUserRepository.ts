
import { User } from '@/shared/domain/user/model/User';
import { UserRepositoryPort } from '@/shared/domain/user/repository/UserRepositoryPort';
import { auth, database } from '@/server/infra/db/firebase/firebase';
import { equalTo, get, orderByChild, query, ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const FireBaseUserRepository: UserRepositoryPort = {
  async findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  },

  async create(user: User): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, user.email, user.password);
    const fireBaseUser = result.user;

    await updateProfile(fireBaseUser, { displayName: user.username });

    await set(ref(database, `users/${fireBaseUser.uid}`), {
      uid: fireBaseUser.uid,
      email: user.email,
      password: user.password,
      username: user.username,
      photoURL: '',
      followers: null,
      following: null,
      role: 'user',
      createdAt: Date.now(),
      updatedAt: null
    });
    
    return user;
  },

  async update(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  },

  async findByEmail(email: string): Promise<User | null> {
    const usersRef = ref(database, 'users');
    const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      const users = snapshot.val();
      return users;
    }

    return null;
  },

  async searchByName(name: string): Promise<User[]> {
    const usersRef = ref(database, 'users');
    const userQuery = query(usersRef, orderByChild('username'));
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      const users = snapshot.val();
      return Object.values(users)
        .filter((user: any) => 
          user.username.toLowerCase().includes(name.toLowerCase()) ||
          (user.displayName && user.displayName.toLowerCase().includes(name.toLowerCase()))
        )
        .map((user: any) => ({
          id: user.uid,
          email: user.email,
          username: user.username,
          password: '',
          role: user.role,
          photoURL: user.photoURL,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          followers: user.followers,
          following: user.following,
        }));
    }

    return [];
  },

  async loginWithEmail(email: string, password: string): Promise<User | null> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const fireBaseUser = result.user;
    const usersRef = ref(database, 'users');
    const userQuery = query(usersRef, equalTo(fireBaseUser.uid));
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const userId = Object.keys(users)[0];
      const user = users[userId];
      return {
        id: fireBaseUser.uid,
        email: fireBaseUser.email!,
        password: '',
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        photoURL: user.photoURL,
        updatedAt: user.updatedAt,
        followers: user.followers,
        following: user.following,
      };
    }
    return null;
  },

  async loginWithGoogle(googleIdToken: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
};

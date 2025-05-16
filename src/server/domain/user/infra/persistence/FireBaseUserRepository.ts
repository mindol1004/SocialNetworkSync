import { User } from '@/shared/domain/user/model/User';
import { UserRepositoryPort } from '@/shared/domain/user/repository/UserRepositoryPort';
import { auth, database } from '@/server/infra/db/firebase/firebase';
import { equalTo, get, orderByChild, query, ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export class FireBaseUserRepository implements UserRepositoryPort {
  
    findById(id: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }
  
    async create(user: User): Promise<User> {
      const result = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const fireBaseUser = result.user;

      // Update profile
      await updateProfile(fireBaseUser, { displayName: user.username });

      // Create user in database
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
    }
  
    update(user: User): Promise<User> {
        throw new Error('Method not implemented.');
    }
  
    async findByEmail(email: string): Promise<User | null> {
        const usersRef = ref(database, 'users');
        const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
        const snapshot = await get(userQuery);

        if (snapshot.exists()) {
          const users = snapshot.val();
          return users;
        }

        return null;
    }
  
    searchByName(name: string): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
  
    loginWithEmail(email: string, password: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }
  
    loginWithGoogle(googleIdToken: string): Promise<User> {
        throw new Error('Method not implemented.');
    }
  
}
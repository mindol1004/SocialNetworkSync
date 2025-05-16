import { User } from '@/shared/domain/user/model/User';

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  searchByName(name: string): Promise<User[]>;
  loginWithEmail(email: string, password: string): Promise<User | null>;
  loginWithGoogle(googleIdToken: string): Promise<User>;
}
import { UserRole } from '@/shared/domain/user/model/UserRole';
import { Follows } from '@/shared/domain/user/model/Follows';

export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  photoURL?: string | null;
  followers?: Record<string, Follows>;
  following?: Record<string, Follows>;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

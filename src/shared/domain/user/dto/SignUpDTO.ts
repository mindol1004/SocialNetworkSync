import { User } from '../model/User';
import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(2),
});

export interface SignUpDTO extends z.infer<typeof SignUpSchema> {}

export class SignUpMapper {
  static toEntity(dto: SignUpDTO): User {
    return {
      id: '',
      email: dto.email,
      password: dto.password,
      username: dto.username,
      role: 'user' as const,
      createdAt: new Date(),
      photoURL: null,
      followers: {},
      following: {},
    };
  }
}
import { User } from '../model/User';
import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string({
    required_error: 'email.required'
  }).email('email.invalid'),
  password: z.string({
    required_error: 'password.required'
  }).min(6, 'password.minLength'),
  username: z.string({
    required_error: 'username.required'
  }).min(2, 'username.minLength'),
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
import { User } from "../model/User";

export interface SignUpDTO {
  email: string;
  password: string;
  username: string;
}

export class SignUpMapper {
  static toEntity(dto: SignUpDTO) {
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
import { ErrorFactory } from '@/shared/error/ErrorFactory';
import { AppError } from '@/shared/error/AppError';

export class UserNotFoundError extends AppError {
  constructor(userId: string) {
    super(`사용자를 찾을 수 없습니다: ${userId}`, 404, 'USER_NOT_FOUND');
  }
}

export class UserErrors {
  static userNotFound(userId: string): AppError {
    return new UserNotFoundError(userId);
  }

  static duplicateEmail(email: string): AppError {
    return ErrorFactory.conflict(`이미 등록된 이메일입니다: ${email}`);
  }

  static invalidCredentials(): AppError {
    return ErrorFactory.unauthorized('이메일 또는 비밀번호가 올바르지 않습니다');
  }
}
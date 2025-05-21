
import { UserRepositoryPort } from '@/shared/domain/user/repository/UserRepositoryPort';
import { User } from '@/shared/domain/user/model/User';
import { UserErrors } from '@/shared/domain/user/error/UserErrors';

export const SignInUserService = (userRepository: UserRepositoryPort) => ({
  async loginWithEmail(email: string, password: string): Promise<User | null> {    
    const user = await userRepository.loginWithEmail(email, password);
    if (!user) {
      throw UserErrors.userNotFound(email);
    }
    return user;
  }
});

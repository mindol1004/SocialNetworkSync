import { UserRepositoryPort } from '@/shared/domain/user/repository/UserRepositoryPort';
import { User } from '@/shared/domain/user/model/User';
import { UserErrors } from '@/shared/domain/user/error/UserErrors';

export class SignInUserService {
  private userRepository: UserRepositoryPort;

  constructor(userRepository: UserRepositoryPort) {
    this.userRepository = userRepository;
  }

  async loginWithEmail(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.loginWithEmail(email, password);
    if (!user) {
      throw UserErrors.userNotFound(email);
    }
    return await this.userRepository.loginWithEmail(email, password);
  }
}
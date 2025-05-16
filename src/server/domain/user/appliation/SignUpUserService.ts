import { UserRepositoryPort } from '@/shared/domain/user/repository/UserRepositoryPort';
import { User } from '@/shared/domain/user/model/User';
import { SignUpDTO } from '@/shared/domain/user/dto/SignUpDTO';
import { UserErrors } from '@/shared/domain/user/error/UserErrors';

export class SignUpUserService {
  private userRepository: UserRepositoryPort;

  constructor(userRepository: UserRepositoryPort) {
    this.userRepository = userRepository;
  }

  async createUser(userData: SignUpDTO): Promise<User> {
    this.userRepository.findByEmail(userData.email).then((user) => {
      if (user) {
        throw new UserErrors.duplicateEmail(userData.email);
      }
    });
    return await this.userRepository.create(userData);
  }
}
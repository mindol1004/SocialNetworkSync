
import { UserRepositoryPort } from '@/shared/domain/user/repository/UserRepositoryPort';
import { User } from '@/shared/domain/user/model/User';
import { SignUpDTO } from '@/shared/domain/user/dto/SignUpDTO';
import { UserErrors } from '@/shared/domain/user/error/UserErrors';

export const SignUpUserService = (userRepository: UserRepositoryPort) => ({
  async createUser(userData: SignUpDTO): Promise<User> {
    // const existingUser = await userRepository.findByEmail(userData.email);
    // if (existingUser) {
    //   throw UserErrors.duplicateEmail(userData.email);
    // }
    return await userRepository.create(userData);
  }
});

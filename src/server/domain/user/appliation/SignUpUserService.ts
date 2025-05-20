import { UserRepositoryPort } from '@/shared/domain/user/repository/UserRepositoryPort';
import { User } from '@/shared/domain/user/model/User';
import { UserErrors } from '@/shared/domain/user/error/UserErrors';

export const SignUpUserService = (userRepository: UserRepositoryPort) => ({
  async createUser(userData: User): Promise<User> {
    console.log(userData);
    // const existingUser = await userRepository.findByEmail(userData.email);
    // console.log(existingUser);
    // if (existingUser) {
    //   throw UserErrors.duplicateEmail(userData.email);
    // }
    return await userRepository.create(userData);
  }
});

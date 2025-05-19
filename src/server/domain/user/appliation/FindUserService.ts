import { UserRepositoryPort } from '@/shared/domain/user/repository/UserRepositoryPort';
import { User } from '@/shared/domain/user/model/User';

export const FindUserService = (userRepository: UserRepositoryPort) => ({
  async searchUsers(query: string): Promise<User[]> {
    const emailResults = await userRepository.findByEmail(query) || [];
    const nameResults = await userRepository.searchByName(query);

    const combined = [...(Array.isArray(emailResults) ? emailResults : [emailResults]), ...nameResults];
    return Array.from(new Set(combined.map(user => user.id)))
      .map(id => combined.find(user => user.id === id)!)
      .filter(Boolean);
  }
});
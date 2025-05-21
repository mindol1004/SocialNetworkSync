import { PostRepositoryPort } from '@/shared/domain/post/repository/PostRepositoryPort';
import { Post } from '@/shared/domain/post/model/Post';

export const FindPostService = (postRepository: PostRepositoryPort) => ({
  async findAll(): Promise<Post[]> {
    return await postRepository.findAll();
  },

  async findById(id: string): Promise<Post | null> {
    return await postRepository.findById(id);
  },

  async findByUserId(userId: string): Promise<Post[]> {
    return await postRepository.findByUserId(userId);
  },

});
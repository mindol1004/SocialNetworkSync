import { FindPostService } from '@/server/domain/post/application/FindPostService';
import { FireBasePostRepository } from '@/server/domain/post/infra/persistence/FireBasePostRepository';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { ResponseHandler } from '@/server/infra/response/responseHandler';

const postRepository = FireBasePostRepository;
const findPostService = FindPostService(postRepository);

export const GET = apiHandler(async () => {
  const posts = await findPostService.findAll();
  return ResponseHandler.success(posts);
});
import { SignUpUserService } from '@/server/domain/user/appliation/SignUpUserService';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { NextRequest } from 'next/server';
import { ResponseHandler } from '@/server/infra/response/responseHandler';
import { FireBaseUserRepository } from '@/server/domain/user/infra/persistence/FireBaseUserRepository';

const userRepository = FireBaseUserRepository;
const signUpUserService = SignUpUserService(userRepository);

export const POST = apiHandler(async (req: NextRequest) => {
  const { email, password, username } = await req.json();
  const user = await signUpUserService.createUser();
  return ResponseHandler.success(user);
});

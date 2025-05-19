import { SignInUserService } from '@/server/domain/user/appliation/SignInUserService';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { NextRequest } from 'next/server';
import { ResponseHandler } from '@/server/infra/response/responseHandler';
import { FireBaseUserRepository } from '@/server/domain/user/infra/persistence/FireBaseUserRepository';

const userRepository = FireBaseUserRepository;
const signInUserService = SignInUserService(userRepository);

export const POST = apiHandler(async (req: NextRequest) => {
  const { email, password } = await req.json();
  const user = await signInUserService.loginWithEmail(email, password);
  console.log(user);
  
  return ResponseHandler.success(user);
});

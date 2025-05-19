import { SignUpUserService } from '@/server/domain/user/appliation/SignUpUserService';
import { SignUpDTO } from '@/shared/domain/user/dto/SignUpDTO';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { NextRequest } from 'next/server';
import { ResponseHandler } from '@/server/infra/response/responseHandler';
import { FireBaseUserRepository } from '@/server/domain/user/infra/persistence/FireBaseUserRepository';

const userRepository = FireBaseUserRepository;
const signUpUserService = SignUpUserService(userRepository);

export const POST = apiHandler(async (req: NextRequest) => {
  const signUpDTO = await req.json() as SignUpDTO;
  const user = await signUpUserService.createUser(signUpDTO);
  return ResponseHandler.success(user);
});

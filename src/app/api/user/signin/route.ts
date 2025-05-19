
import { NextRequest, NextResponse } from 'next/server';
import { UserController } from '@/server/domain/user/controller/UserController';
import { FireBaseUserRepository } from '@/server/domain/user/infra/persistence/FireBaseUserRepository';
import { SignInUserService } from '@/server/domain/user/appliation/SignInUserService';
import { handleRequest } from '@/server/utils/handleRequest';

const userRepository = FireBaseUserRepository;
const signInUserService = SignInUserService(userRepository);

export const POST = handleRequest(async (req: NextRequest) => {
  const body = await req.json();
  const { email, password } = body;
  const user = await signInUserService.loginWithEmail(email, password);
  return NextResponse.json({ success: true, data: user });
});

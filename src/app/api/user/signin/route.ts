
import { NextRequest, NextResponse } from 'next/server';
import { UserController } from '@/server/domain/user/controller/UserController';
import { FireBaseUserRepository } from '@/server/domain/user/infra/persistence/FireBaseUserRepository';
import { SignInUserService } from '@/server/domain/user/appliation/SignInUserService';

const userRepository = FireBaseUserRepository;
const signInUserService = SignInUserService(userRepository);
const signInController = UserController.signIn(signInUserService);

export async function POST(req: NextRequest) {
  return signInController.handler(req as any, NextResponse);
}

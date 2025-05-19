import { SignInUserService } from '@/server/domain/user/appliation/SignInUserService';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseHandler } from '@/server/infra/response/responseHandler';
import { FireBaseUserRepository } from '@/server/domain/user/infra/persistence/FireBaseUserRepository';

const userRepository = FireBaseUserRepository;
const signInUserService = SignInUserService(userRepository);

export const POST = apiHandler(async (req: NextRequest, res: NextResponse) => {
  console.log('req.body', req.json());
  const { email, password } = await req.json();
  const user = await signInUserService.loginWithEmail(email, password);
  return ResponseHandler.success(res, user);
});

// export const POST = (signInUserService: ReturnType<typeof SignInUserService>) => 
//   apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
//     const { email, password } = req.body;
//     const user = await signInUserService.loginWithEmail(email, password);
//     ResponseHandler.success(res, user);
//   });

// export const POST = { 
//   signIn: (signInUserService: ReturnType<typeof SignInUserService>) => ({
//     handler: apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
//       const { email, password } = req.body;
//       const user = await signInUserService.loginWithEmail(email, password);
//       ResponseHandler.success(res, user);
//     })
//   })
// };

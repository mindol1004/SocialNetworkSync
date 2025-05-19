import { SignInUserService } from '@/server/domain/user/appliation/SignInUserService';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseHandler } from '@/server/infra/response/responseHandler';

export const POST = { 
  signIn: (signInUserService: ReturnType<typeof SignInUserService>) => ({
    handler: apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
      const { email, password } = req.body;
      const user = await signInUserService.loginWithEmail(email, password);
      ResponseHandler.success(res, user);
    })
  })
};

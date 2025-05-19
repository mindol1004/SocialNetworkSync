
import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseHandler } from '@/server/infra/response/responseHandler';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { SignInUserService } from '../appliation/SignInUserService';
import { SignUpUserService } from '../appliation/SignUpUserService';
import { FindUserService } from '../appliation/FindUserService';

// 각 컨트롤러 메소드를 분리하여 필요한 서비스만 주입받도록 함
export const UserController = {
  signIn: (signInUserService: ReturnType<typeof SignInUserService>) => ({
    handler: apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
      const { email, password } = req.body;
      const user = await signInUserService.loginWithEmail(email, password);
      ResponseHandler.success(res, user);
    })
  }),

  signUp: (signUpUserService: ReturnType<typeof SignUpUserService>) => ({
    handler: apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
      const userData = req.body;
      const newUser = await signUpUserService.createUser(userData);
      ResponseHandler.success(res, newUser, '사용자가 성공적으로 생성되었습니다', 201);    
    })
  }),

  searchUsers: (findUserService: ReturnType<typeof FindUserService>) => ({
    handler: apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        ResponseHandler.error(res, '검색어를 입력해주세요');
        return;
      }
      const users = await findUserService.searchUsers(query);
      ResponseHandler.success(res, users);
    })
  })
};


import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseHandler } from '@/server/infra/response/responseHandler';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { SignInUserService } from '../appliation/SignInUserService';
import { SignUpUserService } from '../appliation/SignUpUserService';
import { FindUserService } from '../appliation/FindUserService';

export const UserController = (
  signInUserService: ReturnType<typeof SignInUserService>,
  signUpUserService: ReturnType<typeof SignUpUserService>,
  findUserService: ReturnType<typeof FindUserService>
) => ({
  // POST /api/auth/signin
  signIn: apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body;
    const user = await signInUserService.loginWithEmail(email, password);
    ResponseHandler.success(res, user);
  }),

  // POST /api/auth/signup
  signUp: apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const userData = req.body;
    const newUser = await signUpUserService.createUser(userData);
    ResponseHandler.success(res, newUser, '사용자가 성공적으로 생성되었습니다', 201);    
  }),

  // GET /api/users/search
  searchUsers: apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      ResponseHandler.error(res, '검색어를 입력해주세요');
      return;
    }

    const users = await findUserService.searchUsers(query);
    ResponseHandler.success(res, users);
  })
});

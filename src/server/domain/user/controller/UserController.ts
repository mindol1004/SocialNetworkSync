import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseHandler } from '@/server/infra/response/responseHandler';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { SignInUserService } from '../appliation/SignInUserService';
import { SignUpUserService } from '../appliation/SignUpUserService';
import { FindUserService } from '../appliation/FindUserService';

export class UserController {
  private signInUserService: SignInUserService;
  private signUpUserService: SignUpUserService;
  private findUserService: FindUserService;

  constructor(
    signInUserService: SignInUserService, 
    signUpUserService: SignUpUserService,
    findUserService : FindUserService
  ) {
    this.signInUserService = signInUserService;
    this.signUpUserService = signUpUserService;
    this.findUserService = findUserService;
  }

  signIn = apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body;
    const user = await this.signInUserService.loginWithEmail(email, password);
    ResponseHandler.success(res, user);
  });

  signUp = apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const userData = req.body;
    const newUser = await this.signUpUserService.createUser(userData);
    ResponseHandler.success(res, newUser, '사용자가 성공적으로 생성되었습니다', 201);    
  });

  searchUsers = apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        ResponseHandler.error(res, '검색어를 입력해주세요');
        return;
      }

      const users = await this.findUserService.searchUsers(query);
      ResponseHandler.success(res, users);
    });
  }

}
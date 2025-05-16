import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseHandler } from '@/server/infra/response/responseHandler';
import { apiHandler } from '@/server/infra/middleware/apiHandler';
import { UserService } from '../application/UserService';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUser = apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const user = await this.userService.getUserById(id as string);
    ResponseHandler.success(res, user);
  });

  createUser = apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const userData = req.body;
    const newUser = await this.userService.createUser(userData);
    ResponseHandler.success(res, newUser, '사용자가 성공적으로 생성되었습니다', 201);
  });
}
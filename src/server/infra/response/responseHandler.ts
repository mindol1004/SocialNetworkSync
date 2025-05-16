import { NextApiResponse } from 'next';
import { ApiSuccessResponse, ApiErrorResponse } from './ApiResponse';

export class ResponseHandler {
  static success<T>(res: NextApiResponse, data: T, message?: string, statusCode = 200): void {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    res.status(statusCode).json(response);
  }

  static error(res: NextApiResponse, code?: string, message?: string, statusCode = 500): void {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
      },
    };

    res.status(statusCode).json(response);
  }
}
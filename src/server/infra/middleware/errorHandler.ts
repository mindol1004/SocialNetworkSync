import { NextApiRequest, NextApiResponse } from 'next';
import { AppError } from '@/shared/error/AppError';

export function errorHandler(error: Error, req: NextApiRequest, res: NextApiResponse) {
  console.error('Error occurred:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
      },
    });
  }

  // 알 수 없는 오류 처리
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 내부 오류가 발생했습니다',
    },
  });
}
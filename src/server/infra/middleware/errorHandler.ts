
import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '@/shared/error/AppError';

export function errorHandler(error: Error, req: NextRequest) {
  console.error('Error occurred:', error);

  if (error instanceof AppError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
      },
    }, { status: error.statusCode });
  }

  // 알 수 없는 오류 처리
  return NextResponse.json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 내부 오류가 발생했습니다',
    },
  }, { status: 500 });
}

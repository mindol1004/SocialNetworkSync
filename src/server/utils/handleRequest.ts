import { NextRequest, NextResponse } from 'next/server';
import { BizError } from '@/shared/error/BizError';
import { HttpStatus } from '@/shared/constants/HttpStatus';

export function handleRequest(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (err) {
      console.error('❌ Global Error:', err);

      if (err instanceof BizError) {
        return NextResponse.json(
          { code: err.status.code, message: err.message },
          { status: err.status.code }
        );
      }

      return NextResponse.json(
        { code: HttpStatus.INTERNAL_SERVER_ERROR.code, message: HttpStatus.INTERNAL_SERVER_ERROR.message },
        { status: HttpStatus.INTERNAL_SERVER_ERROR.code }
      );
    }
  };
}
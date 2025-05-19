
import { NextResponse } from 'next/server';
import { ApiSuccessResponse, ApiErrorResponse } from './ApiResponse';

export class ResponseHandler {
  static success<T>(data: T, message?: string, statusCode = 200): NextResponse {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    return NextResponse.json(response, { status: statusCode });
  }

  static error(code?: string, message?: string, statusCode = 500): NextResponse {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
      },
    };

    return NextResponse.json(response, { status: statusCode });
  }
}

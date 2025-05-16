import { AppError } from './AppError';
import { ErrorTypes } from './ErrorTypes';

export class ErrorFactory {
  static badRequest(message: string): AppError {
    return new AppError(message, ErrorTypes.BAD_REQUEST.statusCode, ErrorTypes.BAD_REQUEST.errorCode);
  }

  static unauthorized(message: string): AppError {
    return new AppError(message, ErrorTypes.UNAUTHORIZED.statusCode, ErrorTypes.UNAUTHORIZED.errorCode);
  }

  static forbidden(message: string): AppError {
    return new AppError(message, ErrorTypes.FORBIDDEN.statusCode, ErrorTypes.FORBIDDEN.errorCode);
  }

  static notFound(message: string): AppError {
    return new AppError(message, ErrorTypes.NOT_FOUND.statusCode, ErrorTypes.NOT_FOUND.errorCode);
  }

  static conflict(message: string): AppError {
    return new AppError(message, ErrorTypes.CONFLICT.statusCode, ErrorTypes.CONFLICT.errorCode);
  }

  static validationError(message: string): AppError {
    return new AppError(message, ErrorTypes.VALIDATION_ERROR.statusCode, ErrorTypes.VALIDATION_ERROR.errorCode);
  }

  static internalServerError(message = '서버 내부 오류가 발생했습니다'): AppError {
    return new AppError(message, ErrorTypes.INTERNAL_SERVER_ERROR.statusCode, ErrorTypes.INTERNAL_SERVER_ERROR.errorCode);
  }

  static serviceUnavailable(message: string): AppError {
    return new AppError(message, ErrorTypes.SERVICE_UNAVAILABLE.statusCode, ErrorTypes.SERVICE_UNAVAILABLE.errorCode);
  }

  static databaseError(message: string): AppError {
    return new AppError(message, ErrorTypes.DATABASE_ERROR.statusCode, ErrorTypes.DATABASE_ERROR.errorCode);
  }
}
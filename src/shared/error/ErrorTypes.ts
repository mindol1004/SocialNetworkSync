export const ErrorTypes = {
  // 클라이언트 오류 (4xx)
  BAD_REQUEST: { statusCode: 400, errorCode: 'BAD_REQUEST' },
  UNAUTHORIZED: { statusCode: 401, errorCode: 'UNAUTHORIZED' },
  FORBIDDEN: { statusCode: 403, errorCode: 'FORBIDDEN' },
  NOT_FOUND: { statusCode: 404, errorCode: 'NOT_FOUND' },
  CONFLICT: { statusCode: 409, errorCode: 'CONFLICT' },
  VALIDATION_ERROR: { statusCode: 422, errorCode: 'VALIDATION_ERROR' },

  // 서버 오류 (5xx)
  INTERNAL_SERVER_ERROR: { statusCode: 500, errorCode: 'INTERNAL_SERVER_ERROR' },
  SERVICE_UNAVAILABLE: { statusCode: 503, errorCode: 'SERVICE_UNAVAILABLE' },
  DATABASE_ERROR: { statusCode: 500, errorCode: 'DATABASE_ERROR' },
};
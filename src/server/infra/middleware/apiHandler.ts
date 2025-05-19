import { NextRequest } from 'next/server';
import { errorHandler } from './errorHandler';

type ApiHandlerFn = (req: NextRequest) => Promise<Response>;

export function apiHandler(handler: ApiHandlerFn) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      return errorHandler(error as Error);
    }
  };
}
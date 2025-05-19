import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from './errorHandler';

type ApiHandlerFn = (req: NextRequest, res: NextResponse) => Promise<void> | void;

export function apiHandler(handler: ApiHandlerFn) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      errorHandler(error as Error);
    }
  };
}
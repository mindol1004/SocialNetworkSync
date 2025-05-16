import { NextApiRequest, NextApiResponse } from 'next';
import { errorHandler } from './errorHandler';

type ApiHandlerFn = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

export function apiHandler(handler: ApiHandlerFn) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      errorHandler(error as Error, req, res);
    }
  };
}
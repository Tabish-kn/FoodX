import { Response, Request, NextFunction } from 'express';
import { ApiResponse } from '@foodx/shared-types';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): Response {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  return res.status(statusCode).json(payload);
}

export function sendError(res: Response, code: string, message: string, statusCode = 400, details?: any): Response {
  const payload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
  return res.status(statusCode).json(payload);
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('💥 Unhandled Error:', err);
  const status = err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  return sendError(res, code, message, status, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}

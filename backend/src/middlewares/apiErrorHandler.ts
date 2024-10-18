import { NextFunction, Request, Response } from 'express';
import { APIError } from '../errors/apiErrors';

function apiErrorHandler(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (err instanceof APIError) {
    return response.status(err.statusCode).json(err.json());
  }

  return next(err);
}

export default apiErrorHandler;

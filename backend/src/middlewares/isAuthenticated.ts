import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import { AuthenticationFailed } from '../errors/apiErrors';
import User from '../models/User';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
  isAdmin: boolean;
}

async function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { authorization = '' } = request.headers;
  const authorizationParts = authorization.split(' ');

  if (authorizationParts.length === 1) {
    throw new AuthenticationFailed(
      'Invalid token header. No credentials provided',
    );
  }

  if (authorizationParts.length > 2) {
    throw new AuthenticationFailed(
      'Invalid token header. Token string should not contain spaces.',
    );
  }

  const [_, token] = authorizationParts;

  try {
    const decoded = verify(token, authConfig.jwt.secretKey);

    const { sub } = decoded as TokenPayload;

    const user = await User.findOne(sub);
    if (!user) {
      throw new Error();
    }

    request.user = user;

    return next();
  } catch {
    throw new AuthenticationFailed('Invalid token.');
  }
}

export default isAuthenticated;

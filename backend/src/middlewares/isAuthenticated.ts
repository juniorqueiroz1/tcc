import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import { AuthenticationFailed } from '../errors/apiErrors';
import Doctor from '../models/Doctor';
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
    console.log('sub', sub);

    const [id, userType] = sub.split('_'); // Separando o ID e o tipo de usuário (user ou doctor)

    let user = null;
    let doctor = null;

    // Verificando o tipo de usuário
    if (userType === 'user') {
      user = await User.findOne(id); // Buscando o usuário pelo ID
      if (!user) {
        throw new AuthenticationFailed('User not found');
      }
    } else if (userType === 'doctor') {
      doctor = await Doctor.findOne(id); // Buscando o médico pelo ID
      if (!doctor) {
        throw new AuthenticationFailed('Doctor not found');
      }
    } else {
      throw new AuthenticationFailed('Invalid user type');
    }

    console.log('user', user, 'doctor', doctor);

    // Atribuindo o usuário ou médico ao request.user
    request.user = user || doctor;

    return next();
  } catch (error) {
    console.error('Erro de autenticação:', error); // Log do erro no console
    throw new AuthenticationFailed(`Invalid token: ${error.message}`);
  }
}


export default isAuthenticated;

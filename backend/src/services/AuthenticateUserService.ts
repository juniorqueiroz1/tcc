import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import { AuthenticationFailed } from '../errors/apiErrors';
import Doctor from '../models/Doctor';
import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User | Doctor | undefined;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userSign = await User.findOne({ where: { email } });
    const doctor = await Doctor.findOne({ where: { email } });

    if (!userSign && !doctor) {
      throw new AuthenticationFailed();
    }

    let passwordLog = '';
    let id = '';

    if (userSign) {
      passwordLog = userSign.password;
      id = userSign.id.toString();
    }
    if (doctor) {
      passwordLog = doctor.password;
      id = doctor.id.toString();
    }

    const passwordMatched = await compare(password, passwordLog);

    if (!passwordMatched) {
      throw new AuthenticationFailed();
    }
    
    if (userSign)
      await userSign.updateLastLogin();

    const token = sign({}, authConfig.jwt.secretKey, {
      subject: id,
      expiresIn: '1d',
    });

    const user = userSign ? userSign : doctor;

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;

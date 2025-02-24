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
    let userType = '';

    if (userSign) {
      passwordLog = userSign.password;
      id = userSign.id.toString();
      userType = 'user'; // Definindo o tipo de usuário como 'user'
    }
    if (doctor) {
      passwordLog = doctor.password;
      id = doctor.id.toString();
      userType = 'doctor'; // Definindo o tipo de usuário como 'doctor'
    }

    const passwordMatched = await compare(password, passwordLog);

    if (!passwordMatched) {
      throw new AuthenticationFailed();
    }
    
    if (userSign) {
      await userSign.updateLastLogin();
    }

    // Modificando o subject do token para incluir tanto o ID quanto o tipo de usuário
    const subject = `${id}_${userType}`;

    const token = sign({}, authConfig.jwt.secretKey, {
      subject, // Agora o subject será no formato 'id_user' ou 'id_doctor'
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

import { ServiceError } from '../errors/apiErrors';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const emailAlreadyUsed = await User.findOne({
      where: { email },
    });

    if (emailAlreadyUsed) {
      throw new ServiceError(
        'Já existe um usuário cadastrado com este endereço de e-mail.',
      );
    }

    const user = User.create({ name, email });
    await user.setPassword(password);
    await user.save();

    return user;
  }
}

export default CreateUserService;

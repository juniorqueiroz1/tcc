import { Expose } from 'class-transformer';
import { IsDefined } from 'class-validator';

class AuthenticateUserDto {
  @Expose()
  @IsDefined()
  email: string;

  @Expose()
  @IsDefined()
  password: string;
}

export default AuthenticateUserDto;

import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, MaxLength } from 'class-validator';

class CreateUserDto {
  @Expose()
  @MaxLength(300)
  @IsDefined()
  name: string;

  @Expose()
  @MaxLength(320)
  @IsEmail()
  @IsDefined()
  email: string;

  @Expose()
  @IsDefined()
  password: string;
}

export default CreateUserDto;

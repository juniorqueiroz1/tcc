import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsInt,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator';

class CreateDoctorDto {

  @Expose()
  @IsInt()
  @IsDefined()
  doctorId: number;

  @Expose()
  @MaxLength(45)
  @IsDefined()
  name: string;

  @Expose()
  @IsInt()
  @IsDefined()
  crm: number;

  @Expose()
  @IsEmail()
  @MaxLength(320)
  @IsDefined()
  email: string;

  @Expose()
  @IsPhoneNumber('BR')
  @IsDefined()
  phone: string; 

  @Expose()
  @IsInt()
  @IsDefined()
  specialityId: number;

  @Expose()
  @IsDefined()
  password: string;
}

export default CreateDoctorDto;

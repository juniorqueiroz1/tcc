// CreateAppointmentDoctorDto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDoctorDto {
  @IsNotEmpty({ message: 'date should not be empty' })
  @IsString({ message: 'date must be a string' })
  date: string;

  @IsNotEmpty({ message: 'time should not be empty' })
  @IsString({ message: 'time must be a string' })
  time: string;

  @IsNotEmpty({ message: 'patient should not be empty' })
  @IsString({ message: 'patient must be a string' })
  patient: string;
}

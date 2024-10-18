import { Expose } from 'class-transformer';
import { IsDefined, IsInt } from 'class-validator';

class CreateDoctorScheduleDto {
  @Expose()
  @IsInt()
  @IsDefined()
  doctorId: number;

  @Expose()
  @IsDefined()
  weekday: string;

  @Expose()
  @IsDefined()
  startTime: string;

  @Expose()
  @IsDefined()
  endTime: string;
}

export default CreateDoctorScheduleDto;

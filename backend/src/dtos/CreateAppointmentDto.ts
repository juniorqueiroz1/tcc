import { Expose } from 'class-transformer';
import { IsDefined, IsMilitaryTime } from 'class-validator';

class CreateAppointmentDto {
  // @Expose()
  // @IsNumber()
  // @IsDefined()
  // scheduleId: number;

  @Expose()
  @IsMilitaryTime()
  @IsDefined()
  time: string;

  @Expose()
  @IsDefined()
  date: string;

  @Expose()
  @IsDefined()
  doctor: number;
}

export default CreateAppointmentDto;

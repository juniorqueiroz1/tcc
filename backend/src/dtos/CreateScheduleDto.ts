import { Expose } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDefined,
  IsInt,
  IsMilitaryTime,
} from 'class-validator';
import IsDateFormatString from '../validation/IsDateFormatString';

class CreateScheduleDto {
  @Expose()
  @IsInt()
  @IsDefined()
  doctorId: number;

  @Expose()
  @IsDateFormatString('yyyy-MM-dd')
  @IsDefined()
  date: string;

  @Expose()
  @IsMilitaryTime({ each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsDefined()
  times: string[];
}

export default CreateScheduleDto;

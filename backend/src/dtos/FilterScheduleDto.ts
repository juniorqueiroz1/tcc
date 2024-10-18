import { Expose, Transform } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';
import { ensureArray } from '../utils';
import IsDateFormatString from '../validation/IsDateFormatString';

class FilterScheduleDto {
  @Expose()
  @IsNumberString({ no_symbols: true }, { each: true })
  @Transform(value => ensureArray(value))
  @IsOptional()
  doctor?: string[];

  @Expose()
  @IsNumberString({ no_symbols: true }, { each: true })
  @Transform(value => ensureArray(value))
  @IsOptional()
  speciality?: string[];

  @Expose()
  @IsDateFormatString('yyyy-MM-dd')
  @IsOptional()
  dateAfter?: string;

  @Expose()
  @IsDateFormatString('yyyy-MM-dd')
  @IsOptional()
  dateBefore?: string;
}

export default FilterScheduleDto;

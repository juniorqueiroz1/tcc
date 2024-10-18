import { Expose, Transform } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';
import { ensureArray } from '../utils';

class FilterDoctorDto {
  @Expose()
  @IsOptional()
  search?: string;

  @Expose()
  @IsNumberString({ no_symbols: true }, { each: true })
  @Transform(value => ensureArray(value))
  @IsOptional()
  speciality: string[];
}

export default FilterDoctorDto;

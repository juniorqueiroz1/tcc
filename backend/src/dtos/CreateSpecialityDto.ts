import { Expose } from 'class-transformer';
import { IsDefined, MaxLength } from 'class-validator';

class CreateSpecialityDto {
  @Expose()
  @IsDefined()
  @MaxLength(45)
  name: string;

  @Expose()
  @IsDefined()
  @MaxLength(255)
  description: string;
}

export default CreateSpecialityDto;
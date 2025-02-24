import { Expose } from 'class-transformer';
import { IsDefined, IsOptional, MaxLength } from 'class-validator';

class CreateAnamnesisDto {
  @Expose()
  @IsDefined()
  @MaxLength(255)
  description: string;

  @Expose()
  @IsDefined()
  appointmentId: number;
}

class UpdateAnamnesisDto {
  @Expose()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}

export { CreateAnamnesisDto, UpdateAnamnesisDto };


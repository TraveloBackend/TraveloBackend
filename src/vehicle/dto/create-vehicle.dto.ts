import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  
  @IsMongoId()
  category: string;

  @IsString()
  @IsNotEmpty()
  plate_number: string;

  @IsString()
  @IsOptional()
  vehicle_model?: string;

  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  year?: string;
}

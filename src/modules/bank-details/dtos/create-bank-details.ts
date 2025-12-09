import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBankDetailsDto {
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  account_holder_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  account_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  routing_number: string;
}

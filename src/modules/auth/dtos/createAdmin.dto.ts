import { IsEmail, IsEmpty, isEmpty, IsEnum, IsNotEmpty, IsOptional, isString, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from 'src/database/user.schema';

export class CreateAdmin {

  @MaxLength(100)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @MaxLength(100)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsOptional()
  is_verified:boolean;
}
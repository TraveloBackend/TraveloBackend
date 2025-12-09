import { IsEmail, IsEmpty, isEmpty, IsEnum, IsNotEmpty, IsOptional, isString, IsString, MaxLength, MinLength } from 'class-validator';
import { Gender, UserRole } from 'src/database/user.schema';

export class SignupDto {
  @MaxLength(100)
  @MinLength(3)
  @IsString()
  @IsOptional()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsEnum(Gender)
  gender: Gender;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsEmpty()
  otp: string;

  @IsOptional()
  fcm_token: string;

  @IsOptional()
  is_notify: boolean;
}
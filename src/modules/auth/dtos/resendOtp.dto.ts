import { IsEmail, IsEmpty, isEmpty, IsEnum, IsNotEmpty, IsOptional, isString, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from 'src/database/user.schema';

export class resendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEmpty()
  otp: string;
}
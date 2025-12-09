import { IsEmail, IsEmpty, isEmpty, IsEnum, IsNotEmpty, IsOptional, isString, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from 'src/database/user.schema';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsOptional()
  fcm_token: string;
}
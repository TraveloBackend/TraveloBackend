import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    password: string;
}
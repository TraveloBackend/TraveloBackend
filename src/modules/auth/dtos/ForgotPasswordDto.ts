import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEmpty()
    otp: string;
}
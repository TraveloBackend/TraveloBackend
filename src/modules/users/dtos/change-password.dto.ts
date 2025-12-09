import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {

    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    old_password: string;

    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    new_password: string;
}
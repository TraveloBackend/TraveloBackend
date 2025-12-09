import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAddressDto {

    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    slug: string;

    @MaxLength(5000)
    @MinLength(1)
    @IsString()
    @IsNotEmpty()
    description: string;
}
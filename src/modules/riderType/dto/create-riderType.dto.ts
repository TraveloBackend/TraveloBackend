import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRiderTypeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsNumber()
    seat_count: number;
    
    @IsNumber()
    base_fee: number;
}

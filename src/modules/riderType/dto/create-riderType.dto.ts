import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRiderTypeDto {
    @IsNumber()
    seat_count: number;
    
    @IsNumber()
    base_fee: number;
}

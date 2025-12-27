import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { Gender } from "src/database/user.schema";

export class UpdateUserDto {
  @MaxLength(100)
  @MinLength(3)
  @IsString()
  @IsOptional()
  full_name: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @IsOptional()
  address: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  city: string;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsOptional()
  otp: string;

  @IsOptional()
  fcm_token: string;

  @IsOptional()
  is_notify: boolean;

  // Files + Expiry Fields
  @IsOptional()
  profile_picture: string;

  @IsOptional()
  transport_operator_license: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  transport_operator_license_expiry: Date;

  @IsOptional()
  driver_license_front: string;

  @IsOptional()
  driver_license_back: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  driver_license_back_expiry: Date;

  @IsOptional()
  bank_statement: string;

  @IsOptional()
  drivers_tag_license: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  drivers_tag_license_expiry: Date;

  @IsOptional()
  id_card_front: string;

  @IsOptional()
  id_card_back: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  id_card_back_expiry: Date;

  @IsOptional()
  vat_certificate: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  vat_certificate_expiry: Date;

  @IsOptional()
  @IsMongoId()
  riderType?: string;

   @IsOptional()
  stripeCustomerId: string;
}

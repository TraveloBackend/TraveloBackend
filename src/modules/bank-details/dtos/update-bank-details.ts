import { PartialType } from '@nestjs/mapped-types';
import { CreateBankDetailsDto } from './create-bank-details';

export class UpdateBankDetailsDto extends PartialType(CreateBankDetailsDto) {}

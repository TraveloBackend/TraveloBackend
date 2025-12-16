import { PartialType } from '@nestjs/mapped-types';
import { CreateRiderTypeDto } from './create-riderType.dto';

export class UpdateRiderTypeDto extends PartialType(CreateRiderTypeDto) {}

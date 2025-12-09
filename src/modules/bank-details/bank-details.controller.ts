import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BankDetailsService } from './bank-details.service';
import { CreateBankDetailsDto } from './dtos/create-bank-details';
import { UpdateBankDetailsDto } from './dtos/update-bank-details';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';


@Controller('bank-details')
@UseGuards(JwtAuthGuard)
export class BankDetailsController {
  constructor(private readonly bankService: BankDetailsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateBankDetailsDto) {
    return this.bankService.create(req.user.user._id, dto);
  }

  @Get()
  find(@Request() req) {
    return this.bankService.findByUser(req.user.user._id);
  }

  @Patch()
  update(@Request() req, @Body() dto: UpdateBankDetailsDto) {
    return this.bankService.update(req.user.user._id, dto);
  }

  @Delete()
  delete(@Request() req) {
    return this.bankService.delete(req.user.user._id);
  }
}

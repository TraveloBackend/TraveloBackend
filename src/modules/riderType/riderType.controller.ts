import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RiderTypeService } from './riderType.service';
import { CreateRiderTypeDto } from './dto/create-riderType.dto';
import {UpdateRiderTypeDto } from './dto/update-riderType.dto';

@Controller('riderType')
export class RiderTypeController {
  constructor(private readonly riderTypeService: RiderTypeService) {}

  @Post('create')
 async create(@Body() createRiderTypeDto: CreateRiderTypeDto) {
    
    const data = await this.riderTypeService.create(createRiderTypeDto);
    return data
  }

  @Get()
  findAll() {
    return this.riderTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.riderTypeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRiderTypeDto: UpdateRiderTypeDto) {
    return this.riderTypeService.update(id, updateRiderTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.riderTypeService.remove(id);
  }
}

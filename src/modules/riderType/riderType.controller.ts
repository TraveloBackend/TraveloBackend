import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RiderTypeService } from './riderType.service';
import { CreateRiderTypeDto } from './dto/create-riderType.dto';
import {UpdateRiderTypeDto } from './dto/update-riderType.dto';

@Controller('vehicle-fee')
export class VehicleFeeController {
  constructor(private readonly riderTypeService: RiderTypeService) {}

  @Post('create')
 async create(@Body() createRiderTypeDto: CreateRiderTypeDto) {
    console.log(createRiderTypeDto,"createVehicleFeeDto")
    const data = await this.riderTypeService.create(createRiderTypeDto);
    return data
  }

  // @Get()
  // findAll() {
  //   return this.vehicleFeeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.vehicleFeeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVehicleFeeDto: UpdateVehicleFeeDto) {
  //   return this.vehicleFeeService.update(+id, updateVehicleFeeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.vehicleFeeService.remove(+id);
  // }
}

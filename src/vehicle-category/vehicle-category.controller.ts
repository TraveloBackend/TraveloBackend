import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehicleCategoryService } from './vehicle-category.service';
import { CreateVehicleCategoryDto } from './dto/create-vehicle-category.dto';
import { UpdateVehicleCategoryDto } from './dto/update-vehicle-category.dto';

@Controller('vehicle-category')
export class VehicleCategoryController {
  constructor(private readonly vehicleCategoryService: VehicleCategoryService) {}

  @Post()
  create(@Body() dto: CreateVehicleCategoryDto) {
    return this.vehicleCategoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.vehicleCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {     // ⬅️ id must be string
    return this.vehicleCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,             // ⬅️ id must be string
    @Body() dto: UpdateVehicleCategoryDto,
  ) {
    return this.vehicleCategoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {      // ⬅️ id must be string
    return this.vehicleCategoryService.remove(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleCategory } from './entities/vehicle-category.entity';
import { CreateVehicleCategoryDto } from './dto/create-vehicle-category.dto';
import { UpdateVehicleCategoryDto } from './dto/update-vehicle-category.dto';

@Injectable()
export class VehicleCategoryService {
  constructor(
    @InjectModel(VehicleCategory.name)
    private readonly categoryModel: Model<VehicleCategory>,
  ) {}

  create(dto: CreateVehicleCategoryDto) {
    return this.categoryModel.create(dto);
  }

  findAll() {
    return this.categoryModel.find();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Vehicle category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateVehicleCategoryDto) {
    const updated = await this.categoryModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('Vehicle category not found');
    }
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.categoryModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Vehicle category not found');
    }
    return { message: 'Deleted successfully' };
  }
}

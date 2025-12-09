import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from './../database/vehicle.schema'
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import {  UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleCategory } from './../database/vehicle-category.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<Vehicle>,

    @InjectModel(VehicleCategory.name)
    private categoryModel: Model<VehicleCategory>,
  ) {}

  async create(driverId: string, dto: CreateVehicleDto) {
    const category = await this.categoryModel.findById(dto.category);
    if (!category) throw new NotFoundException('Category not found');

    return this.vehicleModel.create({
      driver: driverId,
      category: category._id,
      plate_number: dto.plate_number,
      vehicle_model: dto.vehicle_model,
      make: dto.make,
      year: dto.year,

      applied_fee: category.base_fee,
      seat_count: category.seat_count,
    });
  }

  findAll() {
    return this.vehicleModel.find().populate('category').lean();
  }

  update(id: string, dto: UpdateVehicleDto) {
    return this.vehicleModel.findByIdAndUpdate(id, dto, { new: true });
  }

  delete(id: string) {
    return this.vehicleModel.findByIdAndDelete(id);
  }
}

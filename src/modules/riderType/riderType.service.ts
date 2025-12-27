import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RiderType,RiderTypeSchema } from './entities/riderType.entity';
import { CreateRiderTypeDto } from './dto/create-riderType.dto';
import { UpdateRiderTypeDto } from './dto/update-riderType.dto';

@Injectable()
export class RiderTypeService {
  constructor(
    @InjectModel(RiderType.name)
    private readonly riderTypeModel: Model<RiderType>,
  ) {}

  async create(createRiderTypeDto: CreateRiderTypeDto) {
    const vehicleFee = await this.riderTypeModel.create(createRiderTypeDto);
    return {message:"Vehicle fee created successfully.",data:vehicleFee};
  }

  async findAll() {
    return this.riderTypeModel.find().exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid VehicleFee ID: ${id}`);
    }
    const vehicleFee = await this.riderTypeModel.findById(id).exec();
    if (!vehicleFee) {
      throw new NotFoundException(`VehicleFee #${id} not found`);
    }
    return vehicleFee;
  }

  async update(id: string, updateVehicleFeeDto: UpdateRiderTypeDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid VehicleFee ID: ${id}`);
    }
    const updated = await this.riderTypeModel
      .findByIdAndUpdate(id, updateVehicleFeeDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`VehicleFee #${id} not found`);
    }
    return updated;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid VehicleFee ID: ${id}`);
    }
    const deleted = await this.riderTypeModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`VehicleFee #${id} not found`);
    }
    return { message: `VehicleFee #${id} deleted successfully` };
  }
}

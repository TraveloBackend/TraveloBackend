import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {  Vehicle,VehicleSchema } from './../database/vehicle.schema';
import { VehicleCategory, VehicleCategorySchema } from './../database/vehicle-category.schema';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: VehicleCategory.name, schema: VehicleCategorySchema },
    ]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}

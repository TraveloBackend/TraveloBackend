import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleCategory, VehicleCategorySchema } from './../database/vehicle-category.schema';
import { VehicleCategoryController } from './vehicle-category.controller';
import { VehicleCategoryService } from './vehicle-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleCategory.name, schema: VehicleCategorySchema },
    ]),
  ],
  controllers: [VehicleCategoryController],
  providers: [VehicleCategoryService],
  exports: [VehicleCategoryService],
})
export class VehicleCategoryModule {}

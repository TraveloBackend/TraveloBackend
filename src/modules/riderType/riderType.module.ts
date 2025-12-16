import { Module } from '@nestjs/common';
import { RiderTypeService } from './riderType.service';
import { VehicleFeeController } from './riderType.controller';
import { RiderType,RiderTypeSchema } from './entities/riderType.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RiderType.name, schema: RiderTypeSchema },
    ]),
  ],
  controllers: [VehicleFeeController],
  providers: [RiderTypeService],
})
export class RiderTypeModule {}

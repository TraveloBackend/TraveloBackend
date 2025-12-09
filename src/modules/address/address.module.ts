import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Address, AddressSchema } from 'src/database/address.schema';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }])],
    controllers: [AddressController],
    providers: [AddressService],
    exports: [MongooseModule, AddressService]
})
export class AddressModule { }

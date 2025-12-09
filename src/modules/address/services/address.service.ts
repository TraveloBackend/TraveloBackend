import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Address, AddressDocument } from 'src/database/address.schema';
import { CreateAddressDto } from '../dtos/CreateAddressDto';

@Injectable()
export class AddressService {
    constructor(
        @InjectModel(Address.name) private addressModel: Model<AddressDocument>
    ) { }

    async getAllAddress(filters) {
        return this.addressModel.find(filters).exec();
    }


    async updateAddress(body: CreateAddressDto, id: string, session: ClientSession): Promise<AddressDocument | null> {
        return this.addressModel.findByIdAndUpdate(id, body, { session, new: true }).exec();
    }

    async findAddress(id: string): Promise<AddressDocument | null> {
        return this.addressModel.findById(id).exec();
    }

    async createAddresss(body, session: ClientSession) {
        return this.addressModel.create(body, { session, new: true });
    }

    async deleteAddress(id: string): Promise<void> {
        await this.addressModel.findByIdAndDelete(id);
    }
}

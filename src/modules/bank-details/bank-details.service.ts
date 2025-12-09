import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BankDetails } from './../../database/bank-details.schema';
import { CreateBankDetailsDto } from './dtos/create-bank-details';
import { UpdateBankDetailsDto } from './dtos/update-bank-details';

@Injectable()
export class BankDetailsService {
  constructor(
    @InjectModel(BankDetails.name)
    private bankModel: Model<BankDetails>,
  ) {}

  async create(userId: string, dto: CreateBankDetailsDto) {
    const created = new this.bankModel({
      ...dto,
      user: new Types.ObjectId(userId),
    });

    return created.save();
  }

  async findByUser(userId: string) {
    return this.bankModel.findOne({ user: userId }).lean();
  }

  async update(userId: string, dto: UpdateBankDetailsDto) {
    const updated = await this.bankModel.findOneAndUpdate(
      { user: userId },
      dto,
      { new: true },
    );

    if (!updated) throw new NotFoundException('Bank details not found');

    return updated;
  }

  async delete(userId: string) {
    return this.bankModel.findOneAndDelete({ user: userId });
  }
}

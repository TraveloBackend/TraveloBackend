import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { User, UserDocument } from 'src/database/user.schema';
import { SignupDto } from '../../auth/dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateAdmin } from 'src/modules/auth/dtos/createAdmin.dto';
import { resendOtpDto } from 'src/modules/auth/dtos/resendOtp.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async getAllAppUsers() {
    return this.userModel.find({ role: { $ne: 'admin' } }).exec();
  }

  // Find a user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Store OTP temporarily (can be in-memory or database)
  async storeOtp(email: string, otp: string): Promise<void> {
    await this.userModel.updateOne({ email }, { otp: otp, is_verified: true });
  }

  // Find OTP by email
  async findOtpByEmail(email: string): Promise<string | null> {
    const user = await this.userModel.findOne({ email });
    return user?.otp || null;
  }

  async findUser(filters: any) {
    return this.userModel.findOne(filters).exec();
  }

  // Create a new user
  async createUser(SignupDto: SignupDto, session: ClientSession): Promise<User> {
    const createdUser = new this.userModel(SignupDto);
    return createdUser.save({ session });
  }

  async createAdmin(createAdminDto: CreateAdmin): Promise<User> {
    const createAdmin = new this.userModel(createAdminDto);
    return createAdmin.save();
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<UserDocument | null> {
    const user = await this.userModel.findByIdAndUpdate(userId, data, { new: true });
    return user;
  }

  async updateUserData(userId: string, data) {
    const user = await this.userModel.findByIdAndUpdate(userId, data, { new: true });
    return user;
  }

  async updateUserOtp(userId: string, data: resendOtpDto): Promise<UserDocument | null> {
    const user = this.userModel.findByIdAndUpdate(userId, data, { new: true });
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userModel.findByIdAndDelete(userId);
  }

}
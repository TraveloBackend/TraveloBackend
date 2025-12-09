import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AddressService } from '../services/address.service';
import { AddressDocument } from 'src/database/address.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreateAddressDto } from '../dtos/CreateAddressDto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/database/user.schema';

@Controller('user/address')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AddressController {
    constructor(
        private addressService: AddressService,
        @InjectConnection() private readonly connection: Connection
    ) { }

    @Get('/')
    @Roles(UserRole.USER)
    async getAllAddresss(@Request() req) {
        const loginUser = req.user.user;
        const addresss = await this.addressService.getAllAddress({ user_id: loginUser._id });
        return {
            data: addresss
        }
    }

    @Post('create')
    @Roles(UserRole.USER)
    async createAddress(@Request() req, @Body() body: CreateAddressDto): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const loginUser = req.user.user;
            body.user_id = loginUser._id;
            const address = await this.addressService.createAddresss(body, session);
            await session.commitTransaction();
            session.endSession();
            return {
                data: address,
                message: 'Address created successfully!'
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException({
                message: "Internal Server Error!",
                errors: [error]
            });
        }
    }


    @Put('update/:id')
    @Roles(UserRole.USER)
    async updateAddress(@Param('id') id, @Body() body: CreateAddressDto): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const address = await this.addressService.updateAddress(body, id, session);
            await session.commitTransaction();
            session.endSession();
            return {
                data: address,
                message: "Address updated successfully!",
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException({
                message: "Internal Server Error!",
                errors: [error]
            });
        }
    }

    @Get('details/:id')
    @Roles(UserRole.USER)
    async findAddress(@Param('id') id): Promise<any> {
        const address = await this.addressService.findAddress(id);
        if (!address) {
            throw new NotFoundException({
                message: "Address not found!"
            });
        }
        return {
            data: address
        }
    }

    @Delete('delete/:id')
    @Roles(UserRole.USER)
    async deleteAddress(@Param("id") id): Promise<any> {
        const address = await this.addressService.findAddress(id);
        if (!address) {
            throw new NotFoundException({
                message: "Address not found!"
            });
        }

        this.addressService.deleteAddress(id);
        return {
            "message": "Address deleted successfully!"
        }
    }
}

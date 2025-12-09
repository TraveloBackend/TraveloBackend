import { BadRequestException, Body, Controller, Delete, Get, Put, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { log } from 'console';
import { UserRole } from 'src/database/user.schema';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { fileUploadHelper } from 'src/helpers/common.helper';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    @Get('/')
    @Roles(UserRole.ADMIN)
    async getAllUsers() {
        const users = await this.userService.getAllAppUsers();
        return {
            data: users
        }
    }

    @Get('profile')
    @Roles(UserRole.USER, UserRole.DRIVER)
    async getProfile(@Request() req): Promise<any> {
        const loginUser = req.user.user;
        const user = await this.userService.findByEmail(loginUser.email);
        return { data: user }
    }

    // @Put('profile/update')
    // @Roles(UserRole.USER, UserRole.DRIVER)
    // @UseInterceptors(FileInterceptor('profile_picture', profileImageUploadHelper))
    // async profileUpdate(@Request() req, @Body() data: UpdateUserDto, @UploadedFile() file: Express.Multer.File): Promise<any> {
    //     const loginUser = req.user.user;
    //     if (file && file.filename) {
    //         data.profile_picture = `/${file.filename}`;
    //     }
    //     const user = await this.userService.updateUser(loginUser._id, data);
    //     const { password, ...safeUser } = user && user.toObject();
    //     return { message: 'Profile updated successfully', data: { user: safeUser, access_token: this.jwtService.sign({ user }, { secret: process.env.JWT_SECRET }) } };
    // }


    @Put('profile/update')
    @Roles(UserRole.USER, UserRole.DRIVER)
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'profile_picture', maxCount: 1 },
                { name: 'transport_operator_license', maxCount: 1 },
                { name: 'driver_license_front', maxCount: 1 },
                { name: 'driver_license_back', maxCount: 1 },
                { name: 'bank_statement', maxCount: 1 },
                { name: 'drivers_tag_license', maxCount: 1 },
                { name: 'id_card_front', maxCount: 1 },
                { name: 'id_card_back', maxCount: 1 },
                { name: 'vat_certificate', maxCount: 1 },
            ],
            fileUploadHelper('./uploads/user'),
        ),
    )
    async profileUpdate(
        @Request() req,
        @Body() data: UpdateUserDto,
        @UploadedFiles()
        files: {
            profile_picture?: Express.Multer.File[];
            transport_operator_license?: Express.Multer.File[];
            driver_license_front?: Express.Multer.File[];
            driver_license_back?: Express.Multer.File[];
            bank_statement?: Express.Multer.File[];
            drivers_tag_license?: Express.Multer.File[];
            id_card_front?: Express.Multer.File[];
            id_card_back?: Express.Multer.File[];
            vat_certificate?: Express.Multer.File[];
        },
    ): Promise<any> {
        const loginUser = req.user.user;

        for (const field in files) {
            if (files[field]?.[0]) {
                data[field] = files[field][0].path
                    .replace(process.cwd(), '')
                    .replace(/\\/g, '/');
            }
        }

        const user = await this.userService.updateUser(loginUser._id, data);
        const { password, ...safeUser } = user && user.toObject();

        return {
            message: 'Profile updated successfully',
            data: {
                user: safeUser,
                access_token: this.jwtService.sign(
                    { user: safeUser },
                    { secret: process.env.JWT_SECRET },
                ),
            },
        };
    }

    @Put('change-password')
    @Roles(UserRole.ADMIN, UserRole.USER, UserRole.DRIVER)
    async changePassword(@Request() req, @Body() body: ChangePasswordDto): Promise<any> {
        const { old_password, new_password } = body;
        const loginUser = req.user.user;

        // Find the user
        const user = await this.userService.findUser({ id: loginUser._id });
        if (!user) {
            throw new BadRequestException({
                message: 'Bad Request!',
                errors: {
                    user: ['User not found.'],
                },
            });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            throw new BadRequestException({
                message: 'Bad Request!',
                errors: {
                    password: ['Old password is incorrect.'],
                },
            });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        const updatedUser = await this.userService.updateUserData(user.id, { password: hashedPassword });

        return {
            message: 'Password changed successfully',
            data: { user: updatedUser }
        };
    }

    @Delete('account/delete')
    @Roles(UserRole.USER, UserRole.DRIVER)
    async deleteAccount(@Request() req): Promise<any> {
        const loginUser = req.user.user;

        // 🧹 Optionally: delete uploaded files related to the user
        const user = await this.userService.findUser({ id: loginUser._id });
        if (user) {
            const fileFields = [
                'profile_picture',
                'transport_operator_license',
                'driver_license_front',
                'driver_license_back',
                'bank_statement',
                'drivers_tag_license',
                'id_card_front',
                'id_card_back',
                'vat_certificate',
            ];

            fileFields.forEach(field => {
                if (user[field] && fs.existsSync(`.${user[field]}`)) {
                    fs.unlinkSync(`.${user[field]}`); // delete file from storage
                }
            });

            await this.userService.deleteUser(loginUser._id); // delete from DB
        }

        return {
            message: 'Account deleted successfully',
        };
    }

}

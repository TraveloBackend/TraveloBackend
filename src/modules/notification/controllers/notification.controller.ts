import { Controller, Get, Param, Patch, Post, Body, UseGuards, Request, Put } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/database/user.schema';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get('/')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async getAll(@Request() req) {
        const user = req.user.user;
        const notificationData = this.notificationService.getUserNotifications(user._id);
        return {
            data: notificationData
        }
    }

    @Put(':id/read')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async markRead(@Param('id') id: string) {
        const notification = this.notificationService.markAsRead(id);
        return {
            data: notification,
            message: "Mark read successfully!"
        }
    }
}
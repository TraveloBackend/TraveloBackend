import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { PageService } from '../services/page.service';
import { PageDocument } from 'src/database/page.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreatePageDto } from '../dtos/CreatePageDto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from 'src/database/user.schema';

@Controller('page')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PageController {
    constructor(
        private pageService: PageService,
        @InjectConnection() private readonly connection: Connection
    ) { }

    @Get('/')
    @Roles(UserRole.ADMIN, UserRole.USER, UserRole.DRIVER)
    async getAllPages(@Request() req) {
        const slug = req.slug ?? null;
        const pages = await this.pageService.getAllPages(slug);
        return {
            data: pages
        }
    }

    // @Post('create')
    // async createPage(@Body() body: CreatePageDto): Promise<any> {
    //     const page = await this.pageService.createPages(body);
    //     return {
    //         data: page,
    //         message: 'Page created successfully!'
    //     }
    // }


    @Put('update/:id')
    @Roles(UserRole.ADMIN)
    async updatePage(@Param('id') id, @Body() body: CreatePageDto): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const page = await this.pageService.updatePage(body, id, session);
            await session.commitTransaction();
            session.endSession();
            return {
                data: page,
                message: "Page updated successfully!",
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
    @Roles(UserRole.ADMIN, UserRole.USER, UserRole.DRIVER)
    async findPage(@Param('id') id): Promise<any> {
        const page = await this.pageService.findPage(id);
        if (!page) {
            throw new NotFoundException({
                message: "Page not found!"
            });
        }
        return {
            data: page
        }
    }

    // @Delete('delete/:id')
    // async deletePage(@Param("id") id): Promise<any> {
    //     const page = await this.pageService.findPage(id);
    //     if (!page) {
    //         throw new NotFoundException({
    //             message: "Page not found!"
    //         });
    //     }

    //     this.pageService.deletePage(id);
    //     return {
    //         "message": "Page deleted successfully!"
    //     }
    // }
}

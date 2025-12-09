import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Page, PageSchema } from 'src/database/page.schema';
import { PageController } from './controllers/page.controller';
import { PageService } from './services/page.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }])],
    controllers:[PageController],
    providers:[PageService],
    exports:[MongooseModule, PageService]
})
export class PageModule { }

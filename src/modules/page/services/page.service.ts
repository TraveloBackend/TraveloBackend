import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Page, PageDocument } from 'src/database/page.schema';
import { CreatePageDto } from '../dtos/CreatePageDto';

@Injectable()
export class PageService {
    constructor(
        @InjectModel(Page.name) private pageModel: Model<PageDocument>
    ) { }

    async getAllPages(slug) {
        const filters = slug ? { slug: slug } : {};
        return this.pageModel.find(filters).exec();
    }


    async updatePage(body: CreatePageDto, id: string, session: ClientSession): Promise<PageDocument | null> {
        return this.pageModel.findByIdAndUpdate(id, body, { session, new: true }).exec();
    }

    async findPage(id: string): Promise<PageDocument | null> {
        return this.pageModel.findById(id).exec();
    }

    async createPages(body) {
        return this.pageModel.create(body);
    }

    async deletePage(id: string): Promise<void> {
        await this.pageModel.findByIdAndDelete(id);
    }
}

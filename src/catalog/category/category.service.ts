import { Injectable } from '@nestjs/common';
import { CatalogBaseService } from 'src/catalog/catalog.service';
import { PrismaService } from 'src/prisma.service';
import Category from './category.type';

@Injectable()
export class CategoryService extends CatalogBaseService(Category) {
    constructor(private readonly prisma: PrismaService) { super(prisma) }
}
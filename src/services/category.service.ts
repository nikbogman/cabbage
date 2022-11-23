import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { Category } from 'src/types/category.type';
import { CatalogBaseService } from '../utilities/catalog.service';

@Injectable()
export class CategoryService extends CatalogBaseService(Category) {
    constructor(private readonly prisma: PrismaService) { super(prisma) }
}
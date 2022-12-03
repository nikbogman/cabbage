import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { CatalogBaseService } from '../catalog.service';
import { Category } from './category.object-type';

@Injectable()
export class CategoryService extends CatalogBaseService(Category) {
    constructor(private readonly prisma: PrismaService) { super(prisma) }
}
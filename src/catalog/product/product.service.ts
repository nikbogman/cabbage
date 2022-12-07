import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { CatalogBaseService } from '../catalog.service';
import { Product } from './product.object-type';

@Injectable()
export class ProductService extends CatalogBaseService(Product) {
    constructor(private readonly prisma: PrismaService) { super(prisma) }
    // findProductsByCategory
}
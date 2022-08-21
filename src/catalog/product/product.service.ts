import { Injectable } from '@nestjs/common';
import { CatalogBaseService } from 'src/catalog/catalog.service';
import { PrismaService } from 'src/prisma.service';
import Product from './product.type';

@Injectable()
export class ProductService extends CatalogBaseService(Product) {
    constructor(private readonly prisma: PrismaService) { super(prisma) }
}
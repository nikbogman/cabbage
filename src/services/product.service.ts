import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { Product } from 'src/types/product.type';
import { CatalogBaseService } from '../utilities/catalog.service';

@Injectable()
export class ProductService extends CatalogBaseService(Product) {
    constructor(private readonly prisma: PrismaService) { super(prisma) }
}
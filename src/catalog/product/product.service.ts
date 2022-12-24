import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/service';
import { Product } from './product.object-type';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(args?: Prisma.ProductFindManyArgs) {
        return this.prisma.product.findMany(args);
    }

    async findById(id: string, args?: Prisma.ProductArgs) {
        return this.prisma.product.findUnique({ where: { id }, ...args });
    }

    async updateById(id: string, data: Prisma.ProductUpdateWithoutItemsInput) {
        return this.prisma.product.update({ where: { id }, data });
    }
}
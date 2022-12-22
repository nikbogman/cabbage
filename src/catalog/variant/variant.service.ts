import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { CatalogBaseService } from '../catalog.service';
import { Variant } from './variant.object-type';
import { Prisma } from '@prisma/client';
@Injectable()
export class VariantService extends CatalogBaseService(Variant) {
    constructor(private readonly prisma: PrismaService) { super(prisma); }

    async update(id: string, data: Partial<Omit<Variant, 'id'>>) {
        return this.prisma.variant.update({ where: { id }, data });
    }
}
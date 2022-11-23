import { Injectable } from '@nestjs/common';
import { CatalogBaseService } from 'src/catalog/catalog.service';
import { PrismaService } from 'prisma/service';
import Variant from './variant.type';

@Injectable()
export class VariantService extends CatalogBaseService(Variant) {
    constructor(private readonly prisma: PrismaService) {
        super(prisma, { include: { items: true } })
    }
}
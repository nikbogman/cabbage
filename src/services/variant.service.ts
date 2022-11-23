import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { Variant } from 'src/types/variant.type';
import { CatalogBaseService } from '../utilities/catalog.service';

@Injectable()
export class VariantService extends CatalogBaseService(Variant) {
    constructor(private readonly prisma: PrismaService) { super(prisma); }
}
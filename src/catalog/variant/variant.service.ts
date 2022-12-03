import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { CatalogBaseService } from '../catalog.service';
import { Variant } from './variant.object-type';

@Injectable()
export class VariantService extends CatalogBaseService(Variant) {
    constructor(private readonly prisma: PrismaService) { super(prisma); }
}
import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { PrismaService } from 'prisma/service';
import { ItemService } from '../item/item.service';
import { VariantService } from '../../catalog/variant/variant.service';

@Module({
  providers: [
    CartResolver,
    CartService,
    PrismaService,
    ItemService,
    VariantService
  ]
})
export class CartModule { }


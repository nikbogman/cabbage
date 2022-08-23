import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { PrismaService } from 'src/prisma.service';
import { ItemService } from '../item/item.service';
import { VariantService } from 'src/catalog/variant/variant.service';

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


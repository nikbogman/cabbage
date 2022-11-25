import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { CartResolver } from '../resolvers/cart.resolver';
import { CartService } from '../services/cart.service';
import { ItemService } from '../services/item.service';
import { VariantService } from '../services/variant.service';
import { GlobalModule } from '../utils/pubsub.module';

@Module({
  imports: [GlobalModule],
  providers: [
    CartResolver,
    CartService,
    PrismaService,
    ItemService,
    VariantService
  ]
})
export class CartModule { }


import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { CashierResolver } from '../resolvers/casshier.resolver';
import { CartService } from '../services/cart.service';
import { ItemService } from '../services/item.service';
import { VariantService } from '../services/variant.service';
import { GlobalModule } from '../utils/pubsub.module';
import { CartModule } from './cart.module';
import { ItemModule } from './item.module';
import { OrderModule } from './order.module';

@Module({
  imports: [GlobalModule, CartModule, ItemModule, OrderModule],
  providers: [CashierResolver, CartService, ItemService, VariantService, PrismaService]
})
export class CashierModule { }

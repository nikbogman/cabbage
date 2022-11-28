import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { CashierResolver } from '../resolvers/casshier.resolver';
import { CartService } from '../services/cart.service';
import { ItemService } from '../services/item.service';
import { VariantService } from '../services/variant.service';
import { PubSubModule } from '../utilities/pubsub.module';
import { CartModule } from './cart.module';
import { ItemModule } from './item.module';

@Module({
  imports: [PubSubModule, CartModule, ItemModule],
  providers: [CashierResolver, CartService, ItemService, VariantService, PrismaService]
})
export class CashierModule { }

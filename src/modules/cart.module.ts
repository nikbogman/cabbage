import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { PubSubModule } from 'src/utilities/pubsub.module';
import { CartResolver } from '../resolvers/cart.resolver';
import { CartService } from '../services/cart.service';
import { ItemService } from '../services/item.service';
import { VariantService } from '../services/variant.service';

@Module({
  imports: [PubSubModule],
  providers: [
    CartResolver,
    CartService,
    PrismaService,
    ItemService,
    VariantService
  ]
})
export class CartModule { }


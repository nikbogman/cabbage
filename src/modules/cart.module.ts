import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { CartResolver } from 'src/resolvers/cart.resolver';
import { CartService } from 'src/services/cart.service';
import { ItemService } from 'src/services/item.service';
import { VariantService } from 'src/services/variant.service';
import { GlobalModule } from 'src/utils/pubsub.module';

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


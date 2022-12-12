import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { VariantService } from 'src/catalog/variant/variant.service';
import { PubSubModule } from 'src/utilities/pubsub.module';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { ItemService } from './item/item.service';


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


import { CacheModule, Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { ItemModule } from 'src/cart/item/item.module';
import { ItemService } from 'src/cart/item/item.service';
import { PubSubModule } from 'src/utilities/pubsub.module';
import { VariantResolver } from './variant.resolver';
import { VariantService } from './variant.service';


@Module({
    imports: [PubSubModule, ItemModule],
    providers: [VariantResolver, VariantService, ItemService, PrismaService]
})
export class VariantModule { }

import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { PubSubModule } from 'src/utilities/pubsub.module';
import { ItemResolver } from './item.resolver';
import { ItemService } from './item.service';

@Module({
    imports: [PubSubModule],
    providers: [ItemResolver, ItemService, PrismaService]
})
export class ItemModule { }

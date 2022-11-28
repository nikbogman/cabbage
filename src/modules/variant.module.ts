import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { VariantResolver } from '../resolvers/variant.resolver';
import { ItemService } from '../services/item.service';
import { VariantService } from '../services/variant.service';
import { PubSubModule } from '../utilities/pubsub.module';
import { ItemModule } from './item.module';

@Module({
  imports: [PubSubModule, ItemModule],
  providers: [VariantResolver, VariantService, ItemService, PrismaService]
})
export class VariantModule { }

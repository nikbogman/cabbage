import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { VariantResolver } from 'src/resolvers/variant.resolver';
import { ItemService } from 'src/services/item.service';
import { VariantService } from 'src/services/variant.service';
import { GlobalModule } from 'src/utils/pubsub.module';
import { ItemModule } from './item.module';

@Module({
  imports: [GlobalModule, ItemModule],
  providers: [VariantResolver, VariantService, ItemService, PrismaService]
})
export class VariantModule { }

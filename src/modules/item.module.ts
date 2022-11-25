import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { ItemResolver } from '../resolvers/item.resolver';
import { ItemService } from '../services/item.service';

@Module({
  providers: [ItemResolver, ItemService, PrismaService]
})
export class ItemModule { }

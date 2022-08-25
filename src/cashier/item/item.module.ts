import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { PrismaService } from 'prisma/service';

@Module({
  providers: [ItemResolver, ItemService, PrismaService]
})
export class ItemModule { }

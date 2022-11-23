import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { ItemResolver } from 'src/resolvers/item.resolver';
import { ItemService } from 'src/services/item.service';

@Module({
  providers: [ItemResolver, ItemService, PrismaService]
})
export class ItemModule { }

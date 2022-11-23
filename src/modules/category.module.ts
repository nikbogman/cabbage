import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { CategoryResolver } from 'src/resolvers/category.resolver';
import { CategoryService } from 'src/services/category.service';

@Module({
  providers: [CategoryResolver, CategoryService, PrismaService]
})
export class CategoryModule { }

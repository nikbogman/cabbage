import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { ProductResolver } from '../resolvers/product.resolver';
import { ProductService } from '../services/product.service';

@Module({
  providers: [ProductResolver, ProductService, PrismaService]
})
export class ProductModule { }

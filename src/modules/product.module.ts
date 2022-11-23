import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { ProductResolver } from 'src/resolvers/product.resolver';
import { ProductService } from 'src/services/product.service';

@Module({
  providers: [ProductResolver, ProductService, PrismaService]
})
export class ProductModule { }

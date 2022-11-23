import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { OrderResolver } from 'src/resolvers/order.resolver';
import { OrderService } from 'src/services/order.service';

@Module({
  providers: [OrderResolver, OrderService, PrismaService]
})
export class OrderModule { }

import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { OrderResolver } from '../resolvers/order.resolver';
import { OrderService } from '../services/order.service';

@Module({
  providers: [OrderResolver, OrderService, PrismaService]
})
export class OrderModule { }

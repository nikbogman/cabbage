import { Resolver } from '@nestjs/graphql';
import { OrderService } from '../services/order.service';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) { }
}

import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [CartModule, ItemModule, OrderModule]
})
export class CashierModule { }

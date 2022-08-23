import { Module } from '@nestjs/common';
import { CashierService } from './cashier.service';
import { CashierResolver } from './cashier.resolver';
import { CartModule } from './cart/cart.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';

@Module({
  providers: [CashierResolver, CashierService],
  imports: [CartModule, ItemModule, OrderModule]
})
export class CashierModule { }

import { Resolver } from '@nestjs/graphql';
import { CashierService } from './cashier.service';

@Resolver()
export class CashierResolver {
  constructor(private readonly cashierService: CashierService) {}
}

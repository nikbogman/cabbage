import { Resolver, Query, Context } from '@nestjs/graphql';
import { CartService } from './cart.service';
import Cart from './cart.type';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) { }

  @Query(type => Cart)
  async getCart(@Context() ctx: any) {
    return this.cartService.getCart(ctx.req.session)
  }

  @Query(type => Cart)
  async purgeCart(@Context() ctx: any) {
    return this.cartService.purgeCart(ctx.req.session)
  }
}

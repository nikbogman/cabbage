import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { ItemService } from '../services/item.service';


@Resolver()
export class ItemResolver {
  constructor(private readonly itemService: ItemService) { }

  // subscription to get items
  // getAllItems on every subscription

  // mutation to purge items


  // rethink items as subscription
  // @Mutation()
  // async getItems(@Session() session: SessionType) {
  //   if (session.cartId) {
  //     const items = await this.itemService.getItemsOfCart(session.cartId);
  //     return { data: items }
  //   }
  //   return {
  //     error: {
  //       path: "getItems",
  //       issue: "session",
  //       message: "cart is not registered"
  //     }
  //   }
  // }

  // @Mutation()
  // async purgeItems(@Session() session: SessionType) {
  //   if (session.cartId) {
  //     const deleteManyPayload = await this.itemService.purgeItems(session.cartId);
  //     return { data: deleteManyPayload.count }
  //   }
  //   return {
  //     error: {
  //       path: "getItems",
  //       issue: "session",
  //       message: "cart is not registered"
  //     }
  //   }
  // }

  // remove item from cart by id
  // add item to cart by id
}


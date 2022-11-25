import { Query, Resolver, Mutation } from '@nestjs/graphql';
import { Session } from '../session/session.decorator';
import { ItemService } from '../services/item.service';
import { SessionType } from '../session/session.types';


@Resolver()
export class ItemResolver {
  constructor(private readonly itemService: ItemService) { }

  // subscription to get items
  // getAllItems on every subscription

  // mutation to purge items


  // // rethink items as subscription
  // @Query(() => ItemsResponse)
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

  // @Mutation(() => ItemsResponse)
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
}


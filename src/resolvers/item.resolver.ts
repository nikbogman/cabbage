import { Query, Resolver, Mutation } from '@nestjs/graphql';
import { Session } from 'src/session/session.decorator';
import { ItemService } from 'src/services/item.service';
import { SessionType } from 'src/session/session.types';
import { ItemsResponse } from 'src/types/item.type';


@Resolver()
export class ItemResolver {
  constructor(private readonly itemService: ItemService) { }

  @Query(() => ItemsResponse)
  async getItems(@Session() session: SessionType) {
    if (session.cartId)
      return { data: this.itemService.getItemsOfCart(session.cartId) }
    return {
      error: {
        path: "getItems",
        issue: "session",
        message: "cart is not registered"
      }
    }
  }

  @Mutation(() => ItemsResponse)
  async purgeItems(@Session() session: SessionType) {
    if (session.cartId)
      return { data: await this.itemService.purgeItems(session.cartId) }
    return {
      error: {
        path: "getItems",
        issue: "session",
        message: "cart is not registered"
      }
    }
  }
}


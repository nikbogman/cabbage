import { Query, Resolver } from '@nestjs/graphql';
import { SessionType, Session } from '../../session';
import { ItemService } from './item.service';
import Item from './item.type';

@Resolver()
export class ItemResolver {
  constructor(private readonly itemService: ItemService) { }

  @Query(() => [Item])
  async getItems(@Session() session: SessionType) {
    return this.itemService.getItems(session.cartId)
  }
}

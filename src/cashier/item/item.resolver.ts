import { Query, Resolver } from '@nestjs/graphql';
import { Session } from 'src/utils/functions';
import { SessionType } from 'src/utils/types';
import { ItemService } from './item.service';
import Item from './item.type';

@Resolver()
export class ItemResolver {
  constructor(private readonly itemService: ItemService) { }

  @Query(type => [Item])
  async getItems(@Session() session: SessionType) {
    return this.itemService.getItems(session.cartId)
  }
}

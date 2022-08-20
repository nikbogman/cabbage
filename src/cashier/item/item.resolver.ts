import { Resolver } from '@nestjs/graphql';
import { ItemService } from './item.service';

@Resolver()
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}
}

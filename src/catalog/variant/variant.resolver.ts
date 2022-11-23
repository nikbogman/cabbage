import { Inject } from '@nestjs/common';
import { Resolver, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { CatalogBaseResolver } from '../catalog.resolver';
import { VariantService } from './variant.service';
import Variant from './variant.type';
import { PubSubEngine } from 'graphql-subscriptions';
import { ItemService } from 'src/cashier/item/item.service';

@Resolver(() => Variant)
export class VariantResolver extends CatalogBaseResolver(Variant) {
  constructor(
    private readonly variantService: VariantService,
    private readonly itemService: ItemService,
    @Inject('PUB_SUB') private readonly pubsub: PubSubEngine
  ) { super(variantService); }

  @ResolveField()
  async availability(@Parent() variant: Variant) {
    const items = await this.itemService.getItems(variant.id);
    let availability = 0;
    items.map(item => availability += item.quantity);
    return availability;
  }

  @Subscription(() => Variant)
  subscribeHere() {
    return this.pubsub.asyncIterator('subscribeHere')
  }
}



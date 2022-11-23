import { Inject } from '@nestjs/common';
import { Resolver, ResolveField, Parent, Subscription } from '@nestjs/graphql';

import { PubSubEngine } from 'graphql-subscriptions';
import { VariantService } from 'src/services/variant.service';
import { Variant } from 'src/types/variant.type';
import { CatalogBaseResolver } from '../utilities/catalog.resolver';

@Resolver(() => Variant)
export class VariantResolver extends CatalogBaseResolver(Variant) {
   constructor(
      private readonly variantService: VariantService,
      @Inject('PUB_SUB') private readonly pubsub: PubSubEngine
   ) { super(variantService); }

   @ResolveField()
   async availability(@Parent() variant: Variant) {
      // const items = await this.itemService.getItems(variant.id);
      // let availability = 0;
      // items.map(item => availability += item.quantity);
      // return availability;
   }

   @Subscription(() => Variant)
   subscribeHere() {
      return this.pubsub.asyncIterator('subscribeHere')
   }
}



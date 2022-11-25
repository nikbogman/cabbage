import { Inject } from '@nestjs/common';
import { Resolver, ResolveField, Parent, Subscription, Args } from '@nestjs/graphql';

import { PubSubEngine } from 'graphql-subscriptions';
import { ItemService } from '../services/item.service';
import { VariantService } from '../services/variant.service';
import { Variant } from '../types/variant.type';
import { CatalogBaseResolver } from '../utilities/catalog.resolver';

@Resolver(() => Variant)
export class VariantResolver extends CatalogBaseResolver(Variant) {
   constructor(
      private readonly itemService: ItemService,
      private readonly variantService: VariantService,
      @Inject('PUB_SUB') private readonly pubsub: PubSubEngine
   ) { super(variantService); }

   @ResolveField()
   async availability(@Parent() variant: Variant) {
      return this.itemService.getAvailabilityOfVariant(variant.id);
   }

   @Subscription(() => Variant, {
      filter: (payload, variables) =>
         payload.subscribeForVariant.id === variables.id,
   })
   subscribeForVariant(@Args('id') id: string) {
      return this.pubsub.asyncIterator('subscribeForVariant')
   }
}



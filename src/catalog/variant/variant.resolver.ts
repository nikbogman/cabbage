import { Inject } from '@nestjs/common';
import { Resolver, Query, Args, ResolveField, Parent, Subscription, Context } from '@nestjs/graphql';
import { CatalogBaseResolver } from '../catalog.resolver';
import { VariantService } from './variant.service';
import Variant from './variant.type';
import { PubSubEngine } from 'graphql-subscriptions';

@Resolver(() => Variant)
export class VariantResolver extends CatalogBaseResolver(Variant) {
  constructor(private readonly variantService: VariantService,
    @Inject('PUB_SUB') private readonly pubsub: PubSubEngine
  ) { super(variantService) }

  @ResolveField()
  availability(@Parent() variant: Variant) {
    return this.variantService.getAvailability(variant);
  }

  @Subscription(() => Variant)
  subscribeHere() {
    return this.pubsub.asyncIterator('subscribeHere')
  }
}
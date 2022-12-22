import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Resolver, ResolveField, Parent, Subscription, Args } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { CatalogBaseResolver } from '../catalog.resolver';
import { Variant } from './variant.object-type';
import { VariantService } from './variant.service';
import { Cache } from 'cache-manager';
import { ItemService } from '../../cart/item/item.service';

@Resolver(() => Variant)
export class VariantResolver extends CatalogBaseResolver(Variant) {
    constructor(
        private readonly variantService: VariantService,
        @Inject('PUB_SUB') private readonly pubsub: PubSubEngine,
    ) { super(variantService); }

    @Subscription(() => Variant, {
        filter: (payload, variables) =>
            payload.variantSubscription.id === variables.id,
    })
    variantSubscription(@Args('id') id: string) {
        return this.pubsub.asyncIterator('variantSubscription')
    }
}



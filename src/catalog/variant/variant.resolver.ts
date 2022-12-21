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
        private readonly itemService: ItemService,
        private readonly variantService: VariantService,
        @Inject('PUB_SUB') private readonly pubsub: PubSubEngine,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { super(variantService); }

    @ResolveField()
    async availability(@Parent() parent: Variant) {
        // const taken = await this.cacheManager.get<number>(parent.id);
        // return taken ? parent.stock - taken : parent.stock;
        const taken = await this.itemService.getAvailabilityOfVariant(parent.id);
        return parent.stock - taken;
    }

    @Subscription(() => Variant, {
        filter: (payload, variables) =>
            payload.variantSubscription.id === variables.id,
    })
    variantSubscription(@Args('id') id: string) {
        return this.pubsub.asyncIterator('variantSubscription')
    }
}



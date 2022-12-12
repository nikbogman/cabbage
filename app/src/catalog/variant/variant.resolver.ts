import { Inject } from '@nestjs/common';
import { Resolver, ResolveField, Parent, Subscription, Args } from '@nestjs/graphql';

import { PubSubEngine } from 'graphql-subscriptions';
import { ItemService } from 'src/cart/item/item.service';
import { CatalogBaseResolver } from '../catalog.resolver';
import { Variant } from './variant.object-type';
import { VariantService } from './variant.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Resolver(() => Variant)
export class VariantResolver extends CatalogBaseResolver(Variant) {
    constructor(
        private readonly itemService: ItemService,
        private readonly variantService: VariantService,
        @Inject('PUB_SUB') private readonly pubsub: PubSubEngine,
        @InjectRedis() private readonly redis: Redis
    ) { super(variantService); }

    @ResolveField()
    async availability(@Parent() parent: Variant) {
        const taken = await this.redis.get(parent.id) || "0";
        return parent.stock - parseInt(taken);
    }

    @Subscription(() => Variant, {
        filter: (payload, variables) =>
            payload.variantSubscription.id === variables.id,
    })
    variantSubscription(@Args('id') id: string) {
        return this.pubsub.asyncIterator('variantSubscription')
    }
}



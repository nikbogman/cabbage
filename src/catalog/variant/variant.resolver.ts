import { Inject } from '@nestjs/common';
import { Resolver, ResolveField, Parent, Subscription, Args } from '@nestjs/graphql';

import { PubSubEngine } from 'graphql-subscriptions';
import { ItemService } from 'src/cart/item/item.service';
import { CatalogBaseResolver } from '../catalog.resolver';
import { Variant } from './variant.object-type';
import { VariantService } from './variant.service';

@Resolver(() => Variant)
export class VariantResolver extends CatalogBaseResolver(Variant) {
    constructor(
        private readonly itemService: ItemService,
        private readonly variantService: VariantService,
        @Inject('PUB_SUB') private readonly pubsub: PubSubEngine
    ) { super(variantService); }

    @ResolveField()
    async availability(@Parent() parent: Variant) {
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



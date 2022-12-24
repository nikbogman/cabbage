import { Inject } from '@nestjs/common';
import { Resolver, Subscription, Args, Query } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { Product, ProductResponse, ProductsResponse } from './product.object-type';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService,
        @Inject('PUB_SUB') private readonly pubsub: PubSubEngine,
    ) { }

    @Query(() => ProductsResponse)
    async products() {
        const data = await this.productService.findAll()
        if (!data) throw new Error();
        return { data };
    }

    @Query(() => ProductResponse)
    async product(@Args('id') id: string) {
        const data = await this.productService.findById(id);
        if (!data) throw new Error();
        return { data };
    }

    @Subscription(() => Product, {
        filter: (payload, variables) => payload.productSubscription.id === variables.id,
    })
    productSubscription(@Args('id') id: string) {
        return this.pubsub.asyncIterator('productSubscription')
    }
}



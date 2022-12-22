import { Inject } from '@nestjs/common';
import { Query, Resolver, Mutation, Args, Context, Subscription, SubscriptionOptions } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { Item } from './item.object-type';
import { MyContextType } from 'src/utilities/resolver-context';
import { ItemService } from './item.service';

@Resolver()
export class ItemResolver {
    constructor(
        private readonly itemService: ItemService,
        @Inject('PUB_SUB') private readonly pubsub: PubSubEngine
    ) { }

    @Query(() => [Item], { defaultValue: [] })
    async getItems(@Context() ctx: MyContextType) {
        const cartId = ctx.cookies.get('cart')['id'];
        return cartId ? this.itemService.getItemsOfCart(cartId) : [];
    }

    @Subscription(() => [Item], {
        resolve: async function (_, __, context, ___) {
            const cartId = context.cookies['cart']['id'];
            return cartId ? this.itemService.getItemsOfCart(cartId) : [];
        },
    })
    itemSubscription(@Context() ctx: MyContextType) {
        return this.pubsub.asyncIterator('itemSubscription')
    }

}


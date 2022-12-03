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

    @Mutation(() => [Item])
    async getItems(@Context() ctx: MyContextType) {
        const cartCookie = ctx.cookies.get('cart');
        if (cartCookie.id) {
            const items = await this.itemService.getItemsOfCart(cartCookie.id);
            return items
        }
        return {}
    }

    @Subscription(() => [Item], {
        resolve: async function (_, __, context, ___) {
            const cartCookie = context.cookies["cart"]
            console.log(cartCookie)
            if (cartCookie.id) {
                const items = await this.itemService.getItemsOfCart(cartCookie.id);
                return items
            }
            return {}
        }
    })
    itemSubscription(@Context() ctx: MyContextType) {
        return this.pubsub.asyncIterator('itemSubscription')
    }
    // @Mutation()
    // async purgeItems(@Session() session: SessionType) {
    //   if (session.cartId) {
    //     const deleteManyPayload = await this.itemService.purgeItems(session.cartId);
    //     return { data: deleteManyPayload.count }
    //   }
    //   return {
    //     error: {
    //       path: "getItems",
    //       issue: "session",
    //       message: "cart is not registered"
    //     }
    //   }
    // }

    // remove item from cart by id
    // add item to cart by id
}


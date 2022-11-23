import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Session } from '../session/session.decorator';
import { SessionType } from '../session';
import { VariantService } from '../catalog/variant/variant.service';
import { CartService } from './cart/cart.service';
import { ItemService } from './item/item.service';
import { createFieldError } from '../utils/error-response';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';


@Resolver()
export class OrderResolver {
    constructor(
        @Inject('PUB_SUB') private readonly pubsub: PubSubEngine,
        private readonly cartService: CartService,
        private readonly itemService: ItemService,
        private readonly variantService: VariantService
    ) { }

    @Mutation()
    async add(
        @Args('slug') slug: string,
        @Args('qty') qty: number = 1,
        @Session() session: SessionType
    ) {
        try {
            const cart = await this.cartService.getCart(session.id, session.userId);
            const variant = await this.variantService.findBySlug(slug, { include: { items: true } })
            const availability = this.variantService.getAvailability(variant);
            if (availability - qty < 0)
                return createFieldError('qty', 'Variant is not available to purchase at the moment')

            await this.itemService.addItem(cart.id, variant.id, variant.price, qty);
            const updatedCart = this.cartService.updateCartTotal(session, variant.price * qty);
            await this.pubsub.publish('subscribeHere', { subscribeHere: variant });
            return { data: updatedCart };
        } catch (error) {
            return createFieldError('slug', error.message);
        }
    }

    @Mutation()
    async remove() {

    }

    @Mutation()
    async purge() {

    }

    @Mutation()
    async destroy() {

    }
}

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Session } from '../session/session.decorator';
import { SessionType } from '../session/session.types';

import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { CartService } from 'src/services/cart.service';
import { ItemService } from 'src/services/item.service';
import { VariantService } from 'src/services/variant.service';
import { CartResponse } from 'src/types/cart.type';
import { FieldedError } from 'src/utilities/error';


@Resolver()
export class CashierResolver {
    constructor(
        @Inject('PUB_SUB') private readonly pubsub: PubSubEngine,
        private readonly cartService: CartService,
        private readonly itemService: ItemService,
        private readonly variantService: VariantService
    ) { }


    @Mutation(() => CartResponse)
    async addToCart(
        @Args('slug') slug: string,
        @Args('qty') qty: number = 1,
        @Session() session: SessionType,
    ) {
        const path = 'addToCart';
        try {
            const [cart, variant] = await Promise.all([
                this.cartService.getCart(session.id, session.userId),
                this.variantService.findBySlug(slug, { include: { items: true } })
            ])
            if (variant.availability - qty < 0)
                return createFieldError('qty', 'Variant is not available to purchase at the moment')

            await this.itemService.addItem(cart.id, variant.id, variant.price, qty);

            const updatedCart = this.cartService.updateCartTotal(session.id, variant.price * qty);
            await this.pubsub.publish('subscribeForVariant', {
                subscribeForVariant: variant
            })

            return { data: updatedCart };
        } catch (error) {
            // TODO: fix
            return FieldedError.throwError(path)
        }
    }

    @Mutation(() => CartResponse)
    async removeFromCart(
        @Args('slug') slug: string,
        @Args('qty') qty: number = 1,
        @Session() session: SessionType
    ) {
        try {
            if (!session.cartId)
                return createFieldError('qty', 'Cart already empty')

            const variant = await this.variantService.findBySlug(slug);
            const availability = this.variantService.getAvailability(variant);
            if (availability + qty > variant.stock)
                return createFieldError('qty', 'Quantity to remove is too much')

            await this.itemService.removeItem(session.cartId, variant.id, variant.price, qty);
            const updatedCart = this.cartService.updateCartTotal(session.id, -(variant.price * qty));
            return { data: updatedCart };
        } catch (err) {
            return createFieldError('slug', err.message)
        }
    }
}

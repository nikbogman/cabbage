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
            if (!session.cartId)
                throw new FieldedError(path, 'session', `Cart is empthy or not registered`)

            const variant = await this.variantService.findBySlug(slug, { include: { items: true } })
            if (!variant)
                throw new FieldedError(path, 'slug argument', `Variant with slug ${slug} not found`)
            if (variant.availability - qty < 0)
                throw new FieldedError(path, 'qty argument', 'Variant is not available to purchase at the moment')

            await this.itemService.addItem(session.cartId, variant.id, variant.price, qty);
            const newTotal = variant.price * qty + session.total
            const cart = await this.cartService.updateCartTotal(session.id, newTotal);
            session.total = newTotal;

            await this.pubsub.publish('subscribeForVariant', {
                subscribeForVariant: variant
            })

            return { data: cart };
        } catch (error) {
            if (error instanceof FieldedError)
                return error.getFields();
            return new FieldedError(path, 'unknown', error.message)
        }
    }

    @Mutation(() => CartResponse)
    async removeFromCart(
        @Args('slug') slug: string,
        @Args('qty') qty: number = 1,
        @Session() session: SessionType
    ) {
        const path = 'removeFromCart';
        try {
            if (!session.cartId)
                throw new FieldedError(path, 'qty argument', 'Cart already empty')

            const variant = await this.variantService.findBySlug(slug, { include: { items: true } });
            if (!variant)
                throw new FieldedError(path, 'slug argument', `Variant with slug ${slug} not found`)
            if (variant.availability + qty > variant.stock)
                throw new FieldedError(path, 'qty argument', 'Quantity to remove is too much')

            await this.itemService.removeItem(session.cartId, variant.id, variant.price, qty);
            const newTotal = session.total - variant.price * qty
            const cart = await this.cartService.updateCartTotal(session.id, newTotal);
            session.total = newTotal;

            return { data: cart };
        } catch (error) {
            if (error instanceof FieldedError)
                return error.getFields();
            return new FieldedError(path, 'unknown', error.message)
        }
    }
}

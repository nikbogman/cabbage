import { Context, Mutation, Resolver, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { CartService } from '../services/cart.service';
import { ItemService } from '../services/item.service';
import { VariantService } from '../services/variant.service';
import { CartResponse } from '../types/cart.type';
import { MyContextType } from '../utilities/resolver-context';
import { FieldedError } from '../utilities/error';
import { CartCookie } from '../cookie/cookie.type';

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
        @Context() ctx: MyContextType
    ) {
        const path = 'addToCart';
        try {
            const cartCookie: CartCookie = ctx.cookies.get("cart");
            const userId: string = ctx.cookies.get("user-id");
            const cart = await this.cartService.getCart(cartCookie.id, userId);

            const variant = await this.variantService.findBySlug(slug, { include: { items: true } })
            if (!variant)
                throw new FieldedError(
                    path,
                    'slug argument',
                    `Variant with slug ${slug} not found`
                )
            if (variant.availability - qty < 0)
                throw new FieldedError(
                    path,
                    'qty argument',
                    'Variant is not available to purchase at the moment'
                )

            await this.itemService.addItem(cart.id, variant.id, variant.price, qty);
            const newTotal = variant.price * qty + cart.total
            const updated = await this.cartService.updateCart(cart.id, newTotal);

            await this.pubsub.publish('variantSubscription', { variantSubscription: variant })

            ctx.cookies.set("cart", {
                total: newTotal,
                id: cart.id
            });

            return { data: updated };
        } catch (error) {
            if (error instanceof FieldedError)
                return error.getFields();
            return new FieldedError(path, 'unknown', error.message).getFields()
        }
    }

    @Mutation(() => CartResponse)
    async removeFromCart(
        @Args('slug') slug: string,
        @Args('qty') qty: number = 1,
        @Context() ctx: MyContextType
    ) {
        const path = 'removeFromCart';
        try {
            const cartCookie: CartCookie = ctx.cookies.get("cart");
            if (!cartCookie.id)
                throw new FieldedError(path, 'cookie', 'Cart already empty')

            const variant = await this.variantService.findBySlug(slug, { include: { items: true } });
            if (!variant)
                throw new FieldedError(path, 'slug argument', `Variant with slug ${slug} not found`)
            if (variant.availability + qty > variant.stock)
                throw new FieldedError(path, 'qty argument', 'Quantity to remove is too much')


            await this.itemService.removeItem(cartCookie.id, variant.id, variant.price, qty);
            const newTotal = cartCookie.total - variant.price * qty
            const updated = await this.cartService.updateCart(cartCookie.id, newTotal);

            ctx.cookies.set("cart", {
                total: newTotal,
                id: updated.id
            });

            return { data: updated };
        } catch (error) {
            if (error instanceof FieldedError)
                return error.getFields();
            return new FieldedError(path, 'unknown', error.message).getFields()
        }
    }
}

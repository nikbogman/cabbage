import { Inject } from '@nestjs/common';
import { Context, Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { VariantService } from 'src/catalog/variant/variant.service';
import { CartCookie } from 'src/cookie/cookie.type';
import { BooleanResponse } from 'src/utilities/boolean.response';
import { FieldedError } from 'src/utilities/error';
import { MyContextType } from 'src/utilities/resolver-context';
import { Cart, CartResponse } from './cart.object-type';
import { CartService } from './cart.service';
import { ItemService } from './item/item.service';

@Resolver()
export class CartResolver {
    constructor(
        @Inject('PUB_SUB') private readonly pubsub: PubSubEngine,
        private readonly cartService: CartService,
        private readonly itemService: ItemService,
        private readonly variantService: VariantService
    ) { }

    @Query(() => Cart)
    async getCart(@Context() ctx: MyContextType) {
        const cartCookie: CartCookie = ctx.cookies.get("cart");
        const userId: string = ctx.cookies.get("user-id");
        const id = cartCookie !== undefined ? cartCookie.id : "";
        const cart = await this.cartService.getCart(id, userId);
        ctx.cookies.set("cart", {
            id: cart.id,
            total: cart.total
        });
        return cart;
    }

    @Mutation(() => BooleanResponse)
    async deleteCart(@Context() ctx: MyContextType) {
        const cartId: string = ctx.cookies.get("cart")['id'];
        if (!cartId) throw new FieldedError("cookie header", "Cart is allready empthy");




        const cart = await this.cartService.deleteCart(cartId, {
            items: {
                include: {
                    Variant: {
                        select: {
                            available: true
                        }
                    }
                }
            }
        });
        if (!cart) throw new FieldedError("cookie header", "Cart not found")
        for (const item of cart.items) {
            //@ts-ignore
            const available = item.Variant.available + item.quantity;
            await this.variantService.update(item.variantId, { available });
        }
        ctx.httpCtx.res.clearCookie("cart");
        return { data: true }
    }

    @Mutation(() => CartResponse)
    async addToCart(
        @Args('slug') slug: string,
        @Args('qty') qty: number = 1,
        @Context() ctx: MyContextType
    ) {
        const cartCookie: CartCookie = ctx.cookies.get("cart");
        const userId: string = ctx.cookies.get("user-id");
        const id = cartCookie !== undefined ? cartCookie.id : "";
        const cart = await this.cartService.getCart(id, userId);

        let variant = await this.variantService.findBySlug(slug, { include: { items: true } })

        if (!variant) throw new FieldedError('slug argument', `Variant with slug ${slug} not found`)
        if (variant.available - qty < 0)
            throw new FieldedError(
                'qty argument', 'Variant is not available to purchase at the moment')

        await this.itemService.addItem(cart.id, variant.id, variant.price, qty);
        const newTotal = variant.price * qty + cart.total;
        const updated = await this.cartService.updateCart(cart.id, newTotal);

        variant = await this.variantService.update(variant.id, { available: variant.available - qty });
        await this.pubsub.publish('variantSubscription', { variantSubscription: variant })

        await this.pubsub.publish('itemSubscription', { itemSubscription: {} })
        ctx.cookies.set("cart", {
            total: newTotal,
            id: cart.id
        });

        return { data: updated };
    }

    @Mutation(() => CartResponse)
    async removeFromCart(
        @Args('slug') slug: string,
        @Args('qty') qty: number = 1,
        @Context() ctx: MyContextType
    ) {
        const cartCookie: CartCookie = ctx.cookies.get("cart");
        if (!cartCookie.id)
            throw new FieldedError('cookie', 'Cart already empty')

        let variant = await this.variantService.findBySlug(slug, { include: { items: true } });
        if (!variant)
            throw new FieldedError('slug argument', `Variant with slug ${slug} not found`)
        if (variant.available + qty > variant.stock)
            throw new FieldedError('qty argument', 'Quantity to remove is too much')

        await this.itemService.removeItem(cartCookie.id, variant.id, variant.price, qty);
        const newTotal = cartCookie.total - variant.price * qty;
        const updated = await this.cartService.updateCart(cartCookie.id, newTotal);

        variant = await this.variantService.update(variant.id, { available: variant.available + qty });

        await this.pubsub.publish('variantSubscription', { variantSubscription: variant })
        await this.pubsub.publish('itemSubscription', { itemSubscription: {} })

        ctx.cookies.set("cart", {
            total: newTotal,
            id: updated.id
        });

        return { data: updated };

    }

}


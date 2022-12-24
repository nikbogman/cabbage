import { Inject } from '@nestjs/common';
import { Context, Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { ProductService } from 'src/catalog/product/product.service';
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
        private readonly productService: ProductService
    ) { }

    @Query(() => CartResponse)
    async cart(@Context() ctx: MyContextType) {
        const cartId: string = ctx.cookies.get("cart");
        const userId: string = ctx.cookies.get("user-id");
        const cart = await this.cartService.upsertWith(cartId, userId, {
            include: { items: true }
        });
        if (!cartId) ctx.cookies.set("cart", cart.id);
        await this.pubsub.publish('cartSubscription', { cartSubscription: cart })
        return { data: cart };
    }

    @Mutation(() => BooleanResponse)
    async deleteCart(@Context() ctx: MyContextType) {
        const cartId: string = ctx.cookies.get("cart");
        if (!cartId) throw new FieldedError("cookie header", "Cart is allready empthy");

        const cart = await this.cartService.deleteById(cartId, {
            items: {
                include: {
                    Product: {
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
            const available = item.Product.available + item.quantity;
            await this.productService.updateById(item.productId, { available });
        }
        ctx.httpCtx.res.clearCookie("cart");
        return { data: true }
    }

    @Mutation(() => CartResponse)
    async addToCart(
        @Args('id') productId: string,
        @Args('qty') qty: number = 1,
        @Context() ctx: MyContextType
    ) {
        const cartId = ctx.cookies.get("cart");
        const userId: string = ctx.cookies.get("user-id");
        const cart = await this.cartService.upsertWith(cartId, userId, {});
        if (cartId) ctx.cookies.set("cart", cart.id);

        let product = await this.productService.findById(productId, {
            include: { items: true }
        });

        if (!product)
            throw new FieldedError(
                'slug argument', `Product with id ${productId} not found`)
        if (product.available - qty < 0)
            throw new FieldedError(
                'qty argument', 'Variant is not available to purchase at the moment')

        await this.itemService.addItem(cart.id, product.id, product.price, qty);
        product = await this.productService.updateById(product.id, {
            available: product.available - qty
        });
        await Promise.all([
            this.pubsub.publish('cartSubscription', { cartSubscription: cart }),
            this.pubsub.publish('productSubscription', { productSubscription: product }),
        ])

        const newTotal = product.price * qty + cart.total;
        const updated = await this.cartService.updateTotalById(cart.id, newTotal, {
            include: { items: true }
        });
        return { data: updated };
    }

    @Mutation(() => CartResponse)
    async removeFromCart(
        @Args('slug') productId: string,
        @Args('qty') qty: number = 1,
        @Context() ctx: MyContextType
    ) {
        const cartId: string = ctx.cookies.get("cart");
        if (!cartId) throw new FieldedError('cookie', 'Cart already empty')
        const userId: string = ctx.cookies.get("user-id");
        const cart = await this.cartService.upsertWith(cartId, userId, {});

        if (cartId) ctx.cookies.set("cart", cart.id);

        let product = await this.productService.findById(productId, {
            include: { items: true }
        });

        if (!product)
            throw new FieldedError(
                'slug argument', `Product with id ${productId} not found`)
        if (product.available + qty > product.stock)
            throw new FieldedError(
                'qty argument', 'Quantity to remove is too much')

        await this.itemService.removeItemBy(cartId, product.id, product.price, qty);
        product = await this.productService.updateById(product.id, {
            available: product.available + qty
        });

        await Promise.all([
            this.pubsub.publish('cartSubscription', { cartSubscription: cart }),
            this.pubsub.publish('productSubscription', { productSubscription: product }),
        ]);

        const newTotal = cart.total - product.price * qty;
        const updated = await this.cartService.updateTotalById(cartId, newTotal, {
            include: { items: true }
        });

        return { data: updated };
    }

    @Subscription(() => Cart, {
        filter: (payload, __, context) => payload.cartSubscription.id === context.cookies["cart"],
        resolve: (payload) => payload
    })
    cartSubscription() {
        return this.pubsub.asyncIterator('cartSubscription');
    }

}


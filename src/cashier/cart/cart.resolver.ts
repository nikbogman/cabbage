import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { VariantService } from 'src/catalog/variant/variant.service';
import { createFieldError } from '../../utils/error-response'
import { SessionType, Session } from '../../session';
import { ItemService } from '../item/item.service';
import { CartService } from './cart.service';
import Cart, { CartResponse } from './cart.type';
import { BooleanResponse } from 'src/utils/error-response/response';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';

@Resolver()
export class CartResolver {
	constructor(
		private readonly cartService: CartService,
		private readonly itemService: ItemService,
		private readonly variantService: VariantService,
		@Inject('PUB_SUB') private readonly pubsub: PubSubEngine
	) { }

	@Query(() => Cart)
	async getCart(@Session() session: SessionType) {
		return this.cartService.getCart(session);
	}

	@Mutation(() => BooleanResponse)
	async purgeCart(@Session() session: SessionType) {
		const cartId = session.cartId;
		const purged = await this.cartService.purgeCart(session)
		if (purged) {
			await this.cartService.deleteCart(cartId)
			if (!session.userId) session.destroy(err => { })
			return { data: true }
		}
		return { data: false, error: { message: "cart is empthy", field: "session" } }
	}

	@Mutation(() => CartResponse)
	async addItemToCart(
		@Args('slug') slug: string,
		@Args('qty') qty: number = 1,
		@Session() session: SessionType,
	) {
		try {
			const [cart, variant] = await Promise.all([
				this.cartService.getCart(session),
				this.variantService.findBySlug(slug)
			])
			const availability = this.variantService.getAvailability(variant);
			if (availability - qty < 0)
				return createFieldError('qty', 'Variant is not available to purchase at the moment')

			await this.itemService.addItem(cart.id, qty, variant)
			const updatedCart = this.cartService.updateCartTotal(session, variant.price * qty);
			await this.pubsub.publish('subscribeHere', {
				subscribeHere: variant
			})
			return { data: updatedCart };
		} catch (err) {
			return createFieldError('slug', err.message)
		}
	}

	@Mutation(() => CartResponse)
	async removeItemFromCart(
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

			await this.itemService.removeItem(session.cartId, qty, variant)
			const updatedCart = this.cartService.updateCartTotal(session, -(variant.price * qty));
			return { data: updatedCart };
		} catch (err) {
			return createFieldError('slug', err.message)
		}
	}

}

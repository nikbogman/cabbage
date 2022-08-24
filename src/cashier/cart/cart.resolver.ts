import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Session } from 'src/utils/functions';
import { VariantService } from 'src/catalog/variant/variant.service';
import { createFieldError } from 'src/utils/functions';
import { SessionType } from 'src/utils/types';
import { ItemService } from '../item/item.service';
import { CartService } from './cart.service';
import Cart, { CartResponse } from './cart.type';

@Resolver()
export class CartResolver {
	constructor(
		private readonly cartService: CartService,
		private readonly itemService: ItemService,
		private readonly variantService: VariantService
	) { }

	@Query(type => Cart)
	async getCart(@Session() session: SessionType) {
		return this.cartService.getCart(session)
	}

	@Mutation(type => Cart)
	async purgeCart(@Session() session: SessionType) {
		return this.cartService.purgeCart(session)
	}

	@Mutation(type => CartResponse)
	async addItemToCart(
		@Args('slug') slug: string,
		@Args('qty') qty: number = 1,
		@Session() session: SessionType
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
			const updatedCart = this.cartService.updateCartTotal(session, variant.price * qty)
			return { data: updatedCart };
		} catch (err) {
			return createFieldError('slug', err.message)
		}
	}

	@Mutation(type => CartResponse)
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

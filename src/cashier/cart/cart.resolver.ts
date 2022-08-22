import { Resolver, Query, Context, Args } from '@nestjs/graphql';
import { VariantService } from 'src/catalog/variant/variant.service';
import { createFieldError } from 'src/utils';
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
	async getCart(@Context() ctx: any) {
		return this.cartService.getCart(ctx.req.session)
	}

	@Query(type => Cart)
	async purgeCart(@Context() ctx: any) {
		return this.cartService.purgeCart(ctx.req.session)
	}

	@Query(type => CartResponse)
	async addItemToCart(
		@Args('slug') slug: string,
		@Args('qty') qty: number = 0,
		@Context() ctx: any
	) {
		try {
			const [cart, variant] = await Promise.all([
				this.cartService.getCart(ctx.req.session),
				this.variantService.findBySlug(slug)
			])
			const availability = this.variantService.getAvailability(variant);
			if (availability - qty < 0)
				return createFieldError('qty', 'Variant is not available to purchase at the moment')

			await this.itemService.addItem(cart.id, qty, variant)
			const updatedCart = this.cartService.updateCartTotal(ctx.req.session, variant.price * qty)
			return { data: updatedCart };
		} catch (err) {
			return createFieldError('slug', err.message)
		}
	}

	@Query(type => CartResponse)
	async removeItemFromCart(
		@Args('slug') slug: string,
		@Args('qty') qty: number = 0,
		@Context() ctx: any
	) {
		try {
			const variant = await this.variantService.findBySlug(slug);
			const availability = this.variantService.getAvailability(variant);
			if (availability + qty > variant.stock)
				return createFieldError('qty', 'Quantity to remove is too much')

			if (!ctx.req.session.cartId)
				return createFieldError('qty', 'Cart already empty')

			await this.itemService.removeItem(ctx.req.session.cartId, qty, variant)
			const updatedCart = this.cartService.updateCartTotal(ctx.req.session, -(variant.price * qty));
			return { data: updatedCart };
		} catch (err) {
			return createFieldError('slug', err.message)
		}
	}
}

import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { BooleanResponse } from '../utilities/boolean.response';
import { Session } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { SessionType } from '../session/session.types';
import { Cart } from '../types/cart.type';

@Resolver()
export class CartResolver {
	constructor(private readonly cartService: CartService) { }

	@Query(() => Cart)
	async getCart(@Session() session: SessionType) {
		const cart = await this.cartService.getCart(session.id, session.userId);
		session.total = cart.total;
		session.cartId = cart.id;
		return cart;
	}

	@Mutation(() => BooleanResponse)
	async deleteCart(@Session() session: SessionType) {
		const cart = await this.cartService.deleteCart(session.id);
		if (cart) {
			if (!session.userId) {
				session.destroy((err: Error) => {
					if (err) return {
						data: false, error: {
							path: "deleteCart",
							issue: "unknown",
							message: err.message
						}
					}
				})
			}
			session.cartId = undefined;
			return { data: true }
		}
		return {
			data: false,
			error: {
				path: "deleteCart",
				issue: "session",
				message: "Cart is allready empthy"
			}
		}
	}

}

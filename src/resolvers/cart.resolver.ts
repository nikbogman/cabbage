import { Context, Resolver, Query, Mutation } from '@nestjs/graphql';
import { CartCookie } from 'src/cookie/cookie.type';
import { Cart } from 'src/types/cart.type';
import { BooleanResponse } from 'src/utilities/boolean.response';
import { MyContextType } from 'src/utilities/resolver-context';
import { CartService } from '../services/cart.service';

@Resolver()
export class CartResolver {
	constructor(private readonly cartService: CartService) { }

	@Query(() => Cart)
	async getCart(@Context() ctx: MyContextType) {
		const cartCookie: CartCookie = ctx.cookies.get("cart");
		const userId: string = ctx.cookies.get("user-id");
		let cart = await this.cartService.getCart(cartCookie.id, userId);

		ctx.cookies.set("cart", {
			id: cart.id,
			total: cart.total
		});

		return cart;
	}

	@Mutation(() => BooleanResponse)
	async deleteCart(@Context() ctx: MyContextType) {
		const cartCookie: CartCookie = ctx.cookies.get("cart");
		if (!cartCookie.id) return {
			data: false,
			error: {
				path: "deleteCart",
				issue: "cookie",
				message: "Cart is allready empthy"
			}
		}

		const cart = await this.cartService.deleteCart(cartCookie.id);
		if (!cart) return {
			data: false,
			error: {
				path: "deleteCart",
				issue: "cookie",
				message: "Cart not found"
			}
		}
		ctx.res.clearCookie("cart");
		return { data: true }
	}
}

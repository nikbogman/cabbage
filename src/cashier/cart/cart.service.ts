import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SessionType } from 'src/types';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(session: SessionType) {
        if (!session.total) session.total = 0;
        const query = { sessionId: session.id }
        const cart = await this.prisma.cart.upsert({
            where: query,
            update: {},
            create: query,
        })
        if (!session.cartId) session.cartId = cart.id;
        return cart;
    }

    async updateCartTotal(session: SessionType, recepieTotal: number) {
        session.total += recepieTotal;
        return this.prisma.cart.update({
            where: { id: session.cartId },
            data: { total: session.total },
            include: { items: true }
        })
    }

    async purgeCart(session: SessionType) {
        if (!session.total) return;
        session.destroy(err => { })
        return this.prisma.cart.delete({ where: { sessionId: session.id } })
    }

    // add product to cart
    async addToCart(session: SessionType, qty) {

    }
    // remove product from cart

}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { SessionType } from '../../session';
import { ICart } from './cart.type';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(session: SessionType) {
        let cart: ICart;
        if (!session.total) session.total = 0;
        // if user is logged in
        if (session.userId) {
            // check if previous cart exists
            cart = await this.prisma.cart.findUnique({
                where: { userId: session.userId },
                include: { items: true }
            });
            // if it does not exist
            if (!cart) {
                // and current session has cart
                if (session.cartId)
                    // assign this cart to user
                    cart = await this.prisma.cart.update({
                        where: { id: session.cartId },
                        data: { userId: session.userId },
                        include: { items: true }
                    })
                // else create cart
                else cart = await this.prisma.cart.create({
                    data: { userId: session.userId },
                    include: { items: true }
                })
            }
            if (session.cartId)
                await this.prisma.cart.delete({ where: { id: session.cartId } })
        } else {
            if (session.cartId) {
                cart = await this.prisma.cart.findUnique({
                    where: { id: session.cartId },
                    include: { items: true }
                })
            } else cart = await this.prisma.cart.create({ data: {}, include: { items: true } })
        }

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

    // work on purge cart
    async purgeCart(session: SessionType) {
        if (!session.cartId) return false;
        session.total = 0;
        session.cartId = undefined;
        if (!session.userId) this.prisma.cart.delete({ where: { id: session.cartId } });
        return true;
    }
}

import { Injectable } from '@nestjs/common';
import { Cart, Item } from '@prisma/client';
import { PrismaService } from 'prisma/service';
import { SessionType } from '../../session';
import { ICart } from './cart.type';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(session: SessionType) {
        const { userId } = session;
        let cart: ICart = undefined;
        if (userId) {
            cart = await this.prisma.cart.findUnique({
                where: { userId },
                include: { items: true }
            });
            if (session.cartId) {
                if (!cart) {
                    return this.prisma.cart.update({
                        where: { id: session.cartId },
                        data: { userId },
                        include: { items: true }
                    });
                }
                if (cart.id !== session.cartId)
                    await this.prisma.cart.delete({ where: { id: session.cartId } });
            }
            if (!cart) cart = await this.prisma.cart.create({
                data: { userId },
                include: { items: true }
            });

        } else {
            if (session.cartId) {
                cart = await this.prisma.cart.findUnique({
                    where: { id: session.cartId },
                    include: { items: true }
                });
                session.total = cart.total;
                return cart;
            }
            cart = await this.prisma.cart.create({ data: {}, include: { items: true } })
        }
        session.total = cart.total;
        session.cartId = cart.id;
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

    async deleteCart(cartId: string) {
        return this.prisma.cart.delete({ where: { id: cartId } });
    }

    async purgeCart(session: SessionType) {
        if (!session.cartId) return false;
        session.cartId = undefined;
        session.total = 0;
        return true;
    }
}

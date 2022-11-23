import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { SessionType } from '../../session';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(sessionId: string, userId: string) {
        if (userId) {
            return await this.prisma.cart.upsert({
                where: { userId },
                update: { sessionId },
                create: { userId, sessionId },
                include: { items: true }
            })
        }
        const cart = await this.prisma.cart.findUnique({
            where: { sessionId },
            include: { items: true }
        })
        if (!cart) {
            return this.prisma.cart.create({
                data: { sessionId },
                include: { items: true }
            })
        }
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

    async deleteCart(sessionId: string) {
        return this.prisma.cart.delete({ where: { sessionId } });
    }
}

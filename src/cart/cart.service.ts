import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(id: string, userId: string) {
        const expiresAt = new Date(Date.now() + 4000)
        if (userId) {
            return this.prisma.cart.upsert({
                where: { userId },
                update: {},
                create: { userId, expiresAt },
                include: { items: true }
            })
        }
        return this.prisma.cart.upsert({
            where: { id }, update: {},
            create: { userId, expiresAt },
            include: { items: true }
        });
    }

    async updateCart(id: string, newTotal: number) {
        return this.prisma.cart.update({
            where: { id },
            data: { total: newTotal },
            include: { items: true }
        })
    }

    async deleteCart(id: string) {
        return this.prisma.cart.delete({ where: { id } });
    }
}

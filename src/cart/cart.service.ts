import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { Prisma } from '@prisma/client';
@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async upsertWith(id: string = "", userId: string, args: Prisma.CartArgs) {

        return this.prisma.cart.upsert({
            where: { id, userId },
            update: {},
            create: {
                userId,
                expiresAt: new Date(Date.now() + 5000)
            },
            ...args
        });
    }

    async updateTotalById(id: string, newTotal: number, args: Prisma.CartArgs) {
        return this.prisma.cart.update({
            where: { id },
            data: { total: newTotal },
            ...args
        })
    }

    async deleteById(id: string, includes?: Prisma.CartInclude) {
        return this.prisma.cart.delete({ where: { id }, include: includes });
    }
}

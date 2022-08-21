import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SessionType } from 'src/types';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(session: SessionType) {
        if (!session.total) session.total = 0;
        return this.prisma.cart.upsert({
            where: { sessionId: session.id },
            update: {},
            create: { sessionId: session.id }
        })
    }

    async purgeCart(session: SessionType) {
        if (!session.total) return;
        session.destroy(err => { })
        return this.prisma.cart.delete({ where: { sessionId: session.id } })
    }

    // add product to cart
    // remove product from cart

}

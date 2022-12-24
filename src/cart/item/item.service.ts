import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/service';

@Injectable()
export class ItemService {
    constructor(private readonly prisma: PrismaService) { }

    async findWhere(args: Prisma.ItemDeleteManyArgs) {
        return this.prisma.item.findFirst(args);
    }

    async addItem(cartId: string, productId: string, productPrice: number, quantity: number) {
        const item = await this.prisma.item.findFirst({
            where: { productId, cartId }
        });
        if (!item) return this.prisma.item.create({
            data: {
                cartId,
                quantity,
                total: quantity * productPrice,
                productId
            }
        })
        return this.prisma.item.update({
            where: { id: item.id },
            data: {
                quantity: item.quantity + quantity,
                total: item.total + quantity * productPrice
            }
        })
    }

    async removeItemBy(cartId: string, product: { id: string, price: number }, quantity: number) {
        const item = await this.prisma.item.findFirst({
            where: { productId: product.id, cartId }
        });
        if (!item) return undefined;

        if (item.quantity - quantity === 0)
            return this.prisma.item.delete({
                where: { id: item.id }
            });

        return this.prisma.item.update({
            where: { id: item.id },
            data: {
                quantity: item.quantity - quantity,
                total: item.total - quantity * product.price
            }
        })
    }

    async purgeItems(cartId: string) {
        return this.prisma.item.deleteMany({ where: { cartId } });
    }
}

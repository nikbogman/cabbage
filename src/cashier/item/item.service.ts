import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/service';

@Injectable()
export class ItemService {
    constructor(private readonly prisma: PrismaService) { }

    async getItems(cartId: string) {
        return this.prisma.item.findMany({ where: { cartId } });
    }

    async addItem(cartId: string, variantId: string, variantPrice: number, quantity: number) {
        const item = await this.prisma.item.findFirst({ where: { variantId, cartId } });
        if (!item)
            return this.prisma.item.create({
                data: {
                    cartId,
                    quantity,
                    total: quantity * variantPrice,
                    variantId
                }
            })
        return this.prisma.item.update({
            where: { id: item.id },
            data: {
                quantity: item.quantity + quantity,
                total: item.total + quantity * variantPrice
            }
        })
    }

    async removeItem(cartId: string, variantId: string, variantPrice: number, quantity: number) {
        const item = await this.prisma.item.findFirst({ where: { variantId, cartId } });
        if (!item) return undefined;
        if (item.quantity - quantity === 0) {
            return this.prisma.item.delete({ where: { id: item.id } });
        }
        return this.prisma.item.update({
            where: { id: item.id },
            data: {
                quantity: item.quantity - quantity,
                total: item.total - quantity * variantPrice
            }
        })
    }

    async purgeItems(cartId: string) {
        return this.prisma.item.deleteMany({ where: { cartId } });
    }
}

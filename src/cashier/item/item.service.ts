import { Injectable } from '@nestjs/common';
import Variant from 'src/catalog/variant/variant.type';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ItemService {
    constructor(private readonly prisma: PrismaService) { }

    async addItem(cartId: string, quantity: number, variant: Variant) {
        const existing = variant.items.find(i => i.cartId === cartId);
        if (!existing)
            return this.prisma.item.create({
                data: {
                    cartId,
                    quantity,
                    total: quantity * variant.price,
                    variantId: variant.id
                }
            })
        return this.prisma.item.update({
            where: { id: existing.id },
            data: {
                quantity: existing.quantity + quantity,
                total: existing.total + quantity * variant.price
            }
        })
    }

    async removeItem(cartId: string, quantity: number, variant: Variant) {
        const existing = variant.items.find(i => i.cartId === cartId);
        if (!existing)
            throw new Error('No Item found')
        if (existing.quantity - quantity === 0) {
            return this.prisma.item.delete({ where: { id: existing.id } });
        }
        return this.prisma.item.update({
            where: { id: existing.id },
            data: {
                quantity: existing.quantity - quantity,
                total: existing.total - quantity * variant.price
            }
        })
    }

}

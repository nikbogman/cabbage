import { Injectable } from '@nestjs/common';
import { Cart, Item } from '@prisma/client';
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
            cart = await this.prisma.cart.findUnique({
                where: { userId: session.userId },
                include: { items: true }
            });

            if (!cart) {
                if (session.cartId) {
                    cart = await this.prisma.cart.update({
                        where: { id: session.cartId },
                        data: { userId: session.userId },
                        include: { items: true }
                    })
                } else {
                    cart = await this.prisma.cart.create({
                        data: { userId: session.userId },
                        include: { items: true }
                    })
                }
            }

            if (session.cartId !== cart.id)
                await this.prisma.cart.delete({ where: { id: session.cartId } })

        } else {
            if (session.cartId) {
                cart = await this.prisma.cart.findUnique({
                    where: { id: session.cartId },
                    include: { items: true }
                })
            } else {
                cart = await this.prisma.cart.create({ data: {}, include: { items: true } })
            }
        }
        if (!session.cartId) session.cartId = cart.id;
        return cart;
    }

    async getCart2(session: SessionType) {
        if (!session.total) session.total = 0;
        let cart: Cart | ICart;
        if (session.cartId) {
            if (session.userId) {
                cart = await this.prisma.cart.findUnique({
                    where: { userId: session.userId },
                    include: { items: true }
                });
                if (cart) {
                    if (session.cartId !== cart.id) {
                        await this.prisma.cart.delete({ where: { id: session.cartId } });
                        session.cartId = cart.id;
                        session.total = cart.total;
                    }
                    return cart;
                }
                cart = await this.prisma.cart.update({
                    where: { id: session.cartId },
                    data: { userId: session.userId },
                    include: { items: true }
                })
                return cart;
            }
            return this.prisma.cart.findUnique({
                where: { id: session.cartId },
                include: { items: true }
            });
        }
        if (session.userId) {
            cart = await this.prisma.cart.findUnique({
                where: { userId: session.userId },
                include: { items: true }
            });

            if (!cart) cart = await this.prisma.cart.create({ data: { userId: session.userId } });
            session.cartId = cart.id;
            session.total = cart.total;
            return cart;
        }
        cart = await this.prisma.cart.create({ data: {} });
        session.cartId = cart.id;
        session.total = cart.total;
        return cart;
    }

    async getCart3(session: SessionType) {
        const registeredCart = session.cartId;
        let cart: Cart & { items: Item[]; };
        if (session.userId) {
            cart = await this.prisma.cart.findUnique({
                where: { userId: session.userId },
                include: { items: true }
            });
            if (registeredCart && cart) {
                if (registeredCart !== cart.id) {
                    await this.prisma.cart.delete({ where: { id: registeredCart } });
                    session.total = cart.total;
                    session.cartId = cart.id;
                }
                return cart;
            } else if (!registeredCart && cart) {
                session.cartId = cart.id;
                session.total = cart.total;
                return cart;
            } else if (registeredCart && !cart) {
                cart = await this.prisma.cart.update({
                    where: { id: registeredCart },
                    data: { userId: session.userId },
                    include: { items: true }
                });
                return cart;
            } else if (!registeredCart && !cart) {
                cart = await this.prisma.cart.create({
                    data: { userId: session.userId },
                    include: { items: true }
                });
                session.total = 0;
                session.cartId = cart.id;
                return cart;
            }
        } else {
            if (session.cartId) {
                cart = await this.prisma.cart.findUnique({ where: { id: session.cartId }, include: { items: true } });
                session.total = cart.total;
                return cart;
            }
            cart = await this.prisma.cart.create({ data: {}, include: { items: true } })
            session.cartId = cart.id;
            session.total = cart.total;
            return cart;
        }
    }


    async getCart4(session: SessionType) {
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

    // work on purge cart
    async purgeCart(session: SessionType) {
        if (!session.cartId) return false;
        session.total = 0;
        session.cartId = undefined;
        if (!session.userId) this.prisma.cart.delete({ where: { id: session.cartId } });
        return true;
    }
}

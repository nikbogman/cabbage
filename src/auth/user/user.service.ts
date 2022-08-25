import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userInput: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data: userInput
        })
    }

    async find(by: Prisma.UserWhereUniqueInput) {
        return this.prisma.user.findUnique({ where: by })
    }
}

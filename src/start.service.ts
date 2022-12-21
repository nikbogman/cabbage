import { Injectable, Inject, CACHE_MANAGER, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { Cache } from 'cache-manager';
@Injectable()
export class StartService implements OnApplicationBootstrap {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly prisma: PrismaService) { }

    async onApplicationBootstrap() {
        const variants = await this.prisma.variant.findMany();
        console.log(variants);
    }
}

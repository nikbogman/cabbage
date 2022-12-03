import { Type } from '@nestjs/common';
import { PrismaService } from '../../prisma/service';

export function CatalogBaseService<T extends Type<unknown>>(classRef: T): any {
    const model: string = classRef.name.toLowerCase();
    abstract class BaseService {
        constructor(private readonly prisma: PrismaService) { }
        async findAll(options?: object): Promise<T[]> {
            return this.prisma[model].findMany(options);
        }
        async findById(id: string, options?: object): Promise<T> {
            return this.prisma[model].findUnique({ where: { id }, ...options });
        }
        async findBySlug(slug: string, options?: object): Promise<T> {
            return this.prisma[model].findUnique({ where: { slug }, ...options });
        }
    }
    return BaseService;
}
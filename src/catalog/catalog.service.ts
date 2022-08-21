import { PrismaService } from '../prisma.service';

export function CatalogBaseService(classRef: any): any {
    const model: string = classRef.name.toLowerCase()
    abstract class BaseService {
        constructor(
            private readonly prisma: PrismaService,
            private queryOptions: object
        ) { }
        async findAll() {
            return this.prisma[model].findMany(this.queryOptions);
        }
        async findById(id: string) {
            return this.prisma[model].findUnique({ where: { id }, ...this.queryOptions });
        }
        async findBySlug(slug: string, options?: object) {
            return this.prisma[model].findUnique({ where: { slug }, ...this.queryOptions });
        }
    }
    return BaseService;
}
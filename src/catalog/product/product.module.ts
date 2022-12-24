import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { PubSubModule } from 'src/utilities/pubsub.module';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';


@Module({
    imports: [PubSubModule],
    providers: [ProductResolver, ProductService, PrismaService]
})
export class ProductModule { }

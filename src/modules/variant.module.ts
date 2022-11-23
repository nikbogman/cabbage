import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/service';
import { VariantResolver } from 'src/resolvers/variant.resolver';
import { VariantService } from 'src/services/variant.service';
import { GlobalModule } from 'src/utils/pubsub.module';

@Module({
  imports: [GlobalModule],
  providers: [VariantResolver, VariantService, PrismaService]
})
export class VariantModule { }

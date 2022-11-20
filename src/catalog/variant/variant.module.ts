import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantResolver } from './variant.resolver';
import { PrismaService } from 'prisma/service';

@Module({
  providers: [VariantResolver, VariantService, PrismaService]
})
export class VariantModule { }

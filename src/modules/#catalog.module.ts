import { Module } from '@nestjs/common';
import { CategoryModule } from './category.module';
import { ProductModule } from './product.module';
import { VariantModule } from './variant.module';

@Module({
  imports: [CategoryModule, ProductModule, VariantModule]
})
export class CatalogModule { }

import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { VariantModule } from './variant/variant.module';

@Module({
  imports: [CategoryModule, ProductModule, VariantModule]
})
export class CatalogModule { }

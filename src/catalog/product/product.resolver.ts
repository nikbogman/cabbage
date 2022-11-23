import { Resolver } from '@nestjs/graphql';
import { CatalogBaseResolver } from '../catalog.resolver';
import { ProductService } from './product.service';
import Product from './product.type';

@Resolver(() => Product)
export class ProductResolver extends CatalogBaseResolver(Product) {
  constructor(private readonly productService: ProductService) { super(productService); }
}
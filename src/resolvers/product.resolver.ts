import { Resolver } from '@nestjs/graphql';
import { ProductService } from '../services/product.service';
import { Product } from '../types/product.type';
import { CatalogBaseResolver } from '../utilities/catalog.resolver';

@Resolver(() => Product)
export class ProductResolver extends CatalogBaseResolver(Product) {
  constructor(private readonly productService: ProductService) { super(productService); }
}
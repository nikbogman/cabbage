import { Resolver } from '@nestjs/graphql';
import { ProductService } from 'src/services/product.service';
import { Product } from 'src/types/product.type';
import { CatalogBaseResolver } from '../utilities/catalog.resolver';

@Resolver(() => Product)
export class ProductResolver extends CatalogBaseResolver(Product) {
  constructor(private readonly productService: ProductService) { super(productService); }
}
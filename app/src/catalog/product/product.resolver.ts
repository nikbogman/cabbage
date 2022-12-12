import { Resolver } from '@nestjs/graphql';
import { CatalogBaseResolver } from '../catalog.resolver';
import { Product } from './product.object-type';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver extends CatalogBaseResolver(Product) {
    constructor(private readonly productService: ProductService) { super(productService); }
}
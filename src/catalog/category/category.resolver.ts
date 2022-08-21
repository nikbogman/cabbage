import { Resolver } from '@nestjs/graphql';
import { CatalogBaseResolver } from '../catalog.resolver';
import { CategoryService } from './category.service';
import Category from './category.type';

@Resolver(of => Category)
export class CategoryResolver extends CatalogBaseResolver(Category) {
  constructor(private readonly categoryService: CategoryService) { super(categoryService) }
}
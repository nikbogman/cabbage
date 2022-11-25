import { Resolver } from '@nestjs/graphql';
import { CategoryService } from '../services/category.service';
import { Category } from '../types/category.type';
import { CatalogBaseResolver } from '../utilities/catalog.resolver';


@Resolver(() => Category)
export class CategoryResolver extends CatalogBaseResolver(Category) {
  constructor(private readonly categoryService: CategoryService) { super(categoryService); }
}
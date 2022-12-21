import { Resolver } from '@nestjs/graphql';
import { CatalogBaseResolver } from '../catalog.resolver';
import { Category } from './category.object-type';
import { CategoryService } from './category.service';


@Resolver(() => Category)
export class CategoryResolver extends CatalogBaseResolver(Category) {
    constructor(private readonly categoryService: CategoryService) { super(categoryService); }
}
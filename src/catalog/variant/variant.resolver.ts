import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { CatalogBaseResolver } from '../catalog.resolver';
import { VariantService } from './variant.service';
import Variant from './variant.type';

@Resolver(of => Variant)
export class VariantResolver extends CatalogBaseResolver(Variant) {
  constructor(private readonly variantService: VariantService) { super(variantService) }

  @ResolveField()
  availability(@Parent() variant: Variant) {
    const { items } = variant;
    let nonfree = 0;
    items.map(i => nonfree += i.quantity)
    return variant.stock - nonfree;
  }
}
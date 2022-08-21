import { Type } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { plural } from "pluralize";

export function CatalogBaseResolver<T extends Type<unknown>>(classRef: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    constructor(private readonly service: any) { }
    @Query(type => [classRef], { name: `findAll${plural(classRef.name)}` })
    async findAll(): Promise<T[]> {
      return this.service.findAll();
    }
    @Query(type => classRef, { name: `find${classRef.name}ById` })
    async findById(@Args('id') id: string): Promise<T> {
      return this.service.findById(id);
    }
    @Query(type => classRef, { name: `find${classRef.name}BySlug` })
    async findBySlug(@Args('slug') slug: string): Promise<T> {
      return this.service.findBySlug(slug);
    }
  }
  return BaseResolverHost;
}
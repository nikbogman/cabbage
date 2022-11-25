import { Type } from '@nestjs/common';
import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { plural } from 'pluralize';
import { FieldedError } from './error';
import { Response } from './response';

export function CatalogBaseResolver<T extends Type<unknown>>(classRef: T): any {

    const classRefName = classRef.name;


    @Resolver({ isAbstract: true })
    abstract class BaseResolverHost {
        constructor(private readonly service) { }

        @Query(() => [classRef], { name: `findAll${plural(classRefName)}` })
        async findAll() {
            return this.service.findAll();
        }

        @Query(() => classRef, { name: `find${classRefName}BySlug` })
        async findBySlug(@Args('slug') slug: string) {
            const path = `find${classRefName}BySlug`;
            const record = await this.service.findBySlug(slug);
            return record

        }

        @Query(() => classRef, { name: `find${classRefName}ById` })
        async findById(@Args('id') id: string) {
            const record = await this.service.findById(id);
            return record;
        }
    }
    return BaseResolverHost;
}
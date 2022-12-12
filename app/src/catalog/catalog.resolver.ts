import { Type } from '@nestjs/common';
import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { plural } from 'pluralize';
import { ArrayResponse, Response } from 'src/utilities/response';

export function CatalogBaseResolver<T extends Type<unknown>>(classRef: T): any {
    const classRefName = classRef.name;

    @ObjectType(`${plural(classRefName)}Response`)
    class classRefResponses extends ArrayResponse(classRef) { }

    @ObjectType(`${classRefName}Response`)
    class classRefResponse extends Response(classRef) { }

    @Resolver({ isAbstract: true })
    abstract class BaseResolverHost {
        constructor(private readonly service) { }

        @Query(() => classRefResponses, { name: `findAll${plural(classRefName)}` })
        async findAll() {
            return { data: await this.service.findAll() };
        }

        @Query(() => classRefResponse, { name: `find${classRefName}BySlug` })
        async findBySlug(@Args('slug') slug: string) {
            const record = await this.service.findBySlug(slug);
            return { data: record };
        }

        @Query(() => classRefResponse, { name: `find${classRefName}ById` })
        async findById(@Args('id') id: string) {
            const record = await this.service.findById(id);
            return { data: record };
        }
    }
    return BaseResolverHost;
}
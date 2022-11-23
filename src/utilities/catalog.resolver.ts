import { Type } from '@nestjs/common';
import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { plural } from 'pluralize';
import { FieldedError } from './error';
import { Response } from './response';

export function CatalogBaseResolver<T extends Type<unknown>>(classRef: T): any {

    const classRefName = classRef.name;

    @ObjectType(`${classRefName}Response`)
    class ClassRefResponse extends Response(classRef) { }

    @Resolver({ isAbstract: true })
    abstract class BaseResolverHost {
        constructor(private readonly service) { }

        @Query(() => [ClassRefResponse], { name: `findAll${plural(classRefName)}` })
        async findAll() {
            return { data: await this.service.findAll() };
        }

        @Query(() => ClassRefResponse, { name: `find${classRefName}BySlug` })
        async findBySlug(@Args('slug') slug: string) {
            const path = `find${classRefName}BySlug`;
            try {
                const record = await this.service.findBySlug(slug);
                if (!record) throw new FieldedError(path, 'slug argument', `${classRefName} with slug ${slug} not found`)
            } catch (error) {
                return FieldedError.throwError(path, 'unknown', error.message);
            }
        }

        @Query(() => ClassRefResponse, { name: `find${classRefName}ById` })
        async findById(@Args('id') id: string) {
            const path = `find${classRefName}ById`;
            try {
                const record = await this.service.findById(id);
                if (!record) throw new FieldedError(path, 'slug argument', `${classRefName} with slug ${id} not found`)
            } catch (error) {
                return FieldedError.throwError(path, 'unknown', error.message);
            }
        }
    }
    return BaseResolverHost;
}
import { createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { Field, GqlExecutionContext, ObjectType } from '@nestjs/graphql';
import { FieldError } from './graphql-types';
import { IResponseType, IFieldError } from './interfaces';

export const Session = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.session;
    },
);

export const createFieldError = (field: string, message: string) => ({
    error: { field, message }
})

export function Response<T>(classRef: Type<T>): Type<IResponseType<T>> {
    @ObjectType({ isAbstract: true })
    abstract class ResponseType implements IResponseType<T> {
        @Field(() => FieldError, { nullable: true })
        error?: IFieldError;

        @Field(() => classRef, { nullable: true })
        data?: T;
    }
    return ResponseType as Type<IResponseType<T>>;
}


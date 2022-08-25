import { Type } from "@nestjs/common";
import { Field, ObjectType } from "@nestjs/graphql";
import { FieldError, IFieldError } from "./error";

export interface IResponseType<T> {
    error?: IFieldError;
    data?: T;
}

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

@ObjectType()
export class BooleanResponse extends Response(Boolean) { }
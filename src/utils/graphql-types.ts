import { ObjectType, Field } from "@nestjs/graphql";
import { IFieldError } from "./interfaces";
import { Response } from "./functions";

@ObjectType()
export class FieldError implements IFieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
export class BooleanResponse extends Response(Boolean) { }
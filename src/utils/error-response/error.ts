import { ObjectType, Field } from "@nestjs/graphql";

export interface IFieldError {
    field: string;
    message: string;
}

@ObjectType()
export class FieldError implements IFieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

export const createFieldError = (field: string, message: string) => ({
    error: { field, message }
})
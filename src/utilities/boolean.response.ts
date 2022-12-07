import { Field, ObjectType } from '@nestjs/graphql';
import { FieldedErrorObjectType, IFieldedError } from './error';

@ObjectType()
export class BooleanResponse {
    @Field(() => FieldedErrorObjectType, { nullable: true })
    error?: IFieldedError;

    @Field(() => Boolean, { nullable: true })
    data?: boolean;
}
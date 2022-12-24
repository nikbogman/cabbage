import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BooleanResponse {
    @Field()
    message: string;

    @Field({ nullable: true })
    issue?: string;

    @Field(() => Boolean)
    success: boolean;
}
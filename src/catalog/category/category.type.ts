import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Category as Model } from "@prisma/client";

@ObjectType()
export default class Category implements Model {
    @Field(() => ID)
    id: string;

    @Field()
    slug: string;

    @Field()
    name: string;

    @Field()
    description: string;
}


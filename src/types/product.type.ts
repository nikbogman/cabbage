import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Product as Model } from "@prisma/client";

@ObjectType()
export class Product implements Model {
    @Field(() => ID)
    id: string;

    @Field()
    slug: string;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    categoryId: string;
}


import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Item as Model } from "@prisma/client";

@ObjectType()
export default class Item implements Model {
    @Field(type => ID)
    id: string;

    @Field()
    cartId: string;

    @Field()
    variantId: string;

    @Field()
    total: number;

    @Field()
    quantity: number;
}
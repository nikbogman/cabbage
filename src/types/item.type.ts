import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Item as Model } from "@prisma/client";
import { Response } from "src/utilities/response";

@ObjectType()
export class Item implements Model {
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

@ObjectType()
export class ItemsResponse extends Response(Array<Item>) { }
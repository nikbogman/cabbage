import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Variant as Model } from "@prisma/client";

@ObjectType()
export class Variant implements Model {
    @Field(() => ID)
    id: string;

    @Field()
    slug: string;

    @Field()
    name: string;

    @Field()
    optionName: string;

    @Field()
    description: string;

    @Field()
    price: number;

    @Field()
    stock: number;

    @Field()
    productId: string;

    //
    @Field()
    committed: number;

    @Field()
    availability: number;
}


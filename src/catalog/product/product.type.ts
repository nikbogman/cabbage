import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Product as Model } from "@prisma/client";
import Variant from "../variant/variant.type";

interface IProduct extends Model {
    variants: Variant[]
}

@ObjectType()
export default class Product implements IProduct {
    @Field(type => ID)
    id: string;

    @Field()
    slug: string;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    categoryId: string;

    @Field(type => [Variant], { defaultValue: [] })
    variants: Variant[];
}


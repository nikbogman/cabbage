import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Category as Model } from "@prisma/client";
import Product from "../product/product.type";

interface ICategory extends Model {
    products: Product[]
}

@ObjectType()
export default class Category implements ICategory {
    @Field(() => ID)
    id: string;

    @Field()
    slug: string;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => [Product], { defaultValue: [] })
    products: Product[];
}


import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Product as Model } from "@prisma/client";
import { FieldedErrorObjectType, IFieldedError } from "src/utilities/error";
import { ArrayResponse, Response } from "src/utilities/response";

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

@ObjectType()
export class ProductsResponse extends ArrayResponse(Product) { }

@ObjectType()
export class ProductResponse extends Response(Product) { }
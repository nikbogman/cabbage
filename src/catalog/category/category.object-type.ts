import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Category as Model } from "@prisma/client";
import { ArrayResponse, Response } from "src/utilities/response";

@ObjectType()
export class Category implements Model {
    @Field(() => ID)
    id: string;

    @Field()
    slug: string;

    @Field()
    name: string;

    @Field()
    description: string;
}


@ObjectType()
export class CategoriesResponse extends ArrayResponse(Category) { }

@ObjectType()
export class CategoryResponse extends Response(Category) { }
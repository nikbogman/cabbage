import "dotenv/config";
import { join } from "path";

export const env = {
    port: process.env.PORT,
    secret: process.env.SECRET,
}

export const gqlSchemaFile = join(process.cwd(), 'graphql/schema.gql')
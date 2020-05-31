import { readFileSync } from "fs";
import { resolve } from "path";
import { gql } from "apollo-server-express";

const graphqlSchema = readFileSync(resolve(__dirname, "../../schema.graphql"));

export default gql`
  ${graphqlSchema}
`;

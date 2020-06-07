import { ApolloServer } from "apollo-server-express";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

async function buildContext({ req }: ExpressContext) {
  // Get the user token from the headers.
  return { token: req.headers.authorization || "" };
}

export default new ApolloServer({ typeDefs, resolvers, context: buildContext });

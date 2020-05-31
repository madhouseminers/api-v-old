import { ApolloServer } from "apollo-server-express";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

export default new ApolloServer({ typeDefs, resolvers });

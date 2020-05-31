import servers from "./servers/list";
import createServer from "./servers/create";

const resolvers = {
  Query: {
    servers,
  },
  Mutation: {
    createServer,
  },
};

export default resolvers;

import servers from "./servers/list";
import createServer from "./servers/create";

import chat from "./chat/list";

const resolvers = {
  Query: {
    servers,
    chat,
  },
  Mutation: {
    createServer,
  },
};

export default resolvers;

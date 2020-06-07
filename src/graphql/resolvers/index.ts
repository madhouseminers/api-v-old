import servers from "./servers/list";
import createServer from "./servers/create";
import authenticate from "./account/authenticate";
import profile from "./account/profile";

import chat from "./chat/list";

const resolvers = {
  Query: {
    servers,
    chat,
    profile,
  },
  Mutation: {
    createServer,
    authenticate,
  },
};

export default resolvers;

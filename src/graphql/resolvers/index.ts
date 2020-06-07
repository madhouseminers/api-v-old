import servers from "./servers/list";
import createServer from "./servers/create";
import authenticate from "./account/authenticate";
import register from "./account/register";
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
    register,
  },
};

export default resolvers;

import servers from "./servers/list";
import authenticate from "./account/authenticate";
import register from "./account/register";
import profile from "./account/profile";
import whitelist from "./whitelist/fetch";
import updateWhitelist from "./whitelist/update";

import chat from "./chat/list";

const resolvers = {
  Query: {
    servers,
    chat,
    profile,
    whitelist,
  },
  Mutation: {
    authenticate,
    register,
    updateWhitelist,
  },
};

export default resolvers;

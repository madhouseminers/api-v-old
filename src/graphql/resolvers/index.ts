import servers from "./servers/list";
import updated from "./servers/updated";
import authenticate from "./account/authenticate";
import register from "./account/register";
import profile from "./account/profile";
import whitelist from "./whitelist/fetch";
import whitelists from "./whitelist/list";
import updateWhitelist from "./whitelist/update";
import reviewWhitelist from "./whitelist/review";

import chat from "./chat/list";
import { PubSub } from "apollo-server-express";

export const pubsub = new PubSub();
export const SERVER_UPDATED = "SERVER_UPDATED";

const resolvers = {
  Query: {
    servers,
    chat,
    profile,
    whitelist,
    whitelists,
  },
  Mutation: {
    authenticate,
    register,
    updateWhitelist,
    reviewWhitelist,
  },
  Subscription: {
    serverUpdated: updated,
  },
};

export default resolvers;

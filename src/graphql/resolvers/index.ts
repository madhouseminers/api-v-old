import servers from "./servers/list";
import updated from "./servers/updated";
import authenticate from "./account/authenticate";
import register from "./account/register";
import profile from "./account/profile";
import resetPassword from "./account/reset";
import updatePassword from "./account/updatePassword";
import whitelist from "./whitelist/fetch";
import whitelists from "./whitelist/list";
import updateWhitelist from "./whitelist/update";
import reviewWhitelist from "./whitelist/review";
import whitelistUpdate from "./whitelist/updateSubscription";
import validateResetToken from "./account/validateResetToken";

import chat from "./chat/list";
import { PubSub } from "apollo-server-express";
import verifyAccount from "./account/verifyAccount";

export const pubsub = new PubSub();
export const SERVER_UPDATED = "SERVER_UPDATED";
export const WHITELIST_UPDATED = "WHITELIST_UPDATED";

const resolvers = {
  Query: {
    servers,
    chat,
    profile,
    whitelist,
    whitelists,
    validateResetToken,
  },
  Mutation: {
    authenticate,
    register,
    updateWhitelist,
    reviewWhitelist,
    resetPassword,
    updatePassword,
    verifyAccount,
  },
  Subscription: {
    serverUpdated: updated,
    whitelistUpdated: whitelistUpdate,
  },
};

export default resolvers;

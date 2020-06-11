import { pubsub, WHITELIST_UPDATED } from "../index";

export default {
  // Additional event labels can be passed to asyncIterator creation
  subscribe: () => pubsub.asyncIterator([WHITELIST_UPDATED]),
};

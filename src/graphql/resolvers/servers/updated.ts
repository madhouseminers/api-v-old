import { pubsub, SERVER_UPDATED } from "../index";

export default {
  // Additional event labels can be passed to asyncIterator creation
  subscribe: () => pubsub.asyncIterator([SERVER_UPDATED]),
};

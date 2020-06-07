import { AuthenticationError } from "apollo-server-express";
import { requiresAuth } from "../../wrappers/auth";

async function handler(parent: any, args: any, context: { user: any }) {
  if (!context.user) {
    throw new AuthenticationError("Invalid token provided");
  }

  return {
    id: context.user.id,
    email: context.user.email,
    displayName: context.user.display,
  };
}

export default requiresAuth(handler);

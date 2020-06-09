import { AuthenticationError } from "apollo-server-express";
import { requiresAuth } from "../../wrappers/auth";
import db from "../../../db";

async function handler(parent: any, args: any, context: { user: any }) {
  if (!context.user) {
    throw new AuthenticationError("Invalid token provided");
  }

  const results = await db.query(
    "select status, reviewer_feedback from whitelists where user_id=$1 order by submitted desc limit 1",
    [context.user.id]
  );

  let whitelist = {
    status: "NONE",
    feedback: "",
  };

  if (results.rowCount == 1) {
    whitelist.status = results.rows[0].status;
    whitelist.feedback = results.rows[0].reviewer_feedback;
  }

  return {
    id: context.user.id,
    email: context.user.email,
    displayName: context.user.display,
    whitelist: whitelist,
    reviewer: context.user.reviewer,
  };
}

export default requiresAuth(handler);

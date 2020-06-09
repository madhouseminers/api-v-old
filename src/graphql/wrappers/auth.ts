import jwt from "jsonwebtoken";
import db from "../../db";
import { AuthenticationError } from "apollo-server-express";

export const requiresAuth = (handler: Function, reviewerOnly = false) => async (
  parent: any,
  args: any,
  context: { token: string; user: null | object }
) => {
  if (context.token) {
    let tokenDetails;
    try {
      // validate token
      tokenDetails = jwt.verify(context.token, process.env.JWT_KEY as string);
    } catch (e) {
      console.log("Invalid token provided");
    }

    if (tokenDetails) {
      // fetch user
      const results = await db.query("select * from users where id=$1", [
        (tokenDetails as { sub: number }).sub,
      ]);

      if (results.rowCount !== 1) {
        console.log("Invalid user ID in token");
      } else if (reviewerOnly && !results.rows[0].reviewer) {
        throw new AuthenticationError("Unable to access");
      } else {
        context.user = results.rows[0];
      }
    }
  }

  return await handler(parent, args, context);
};

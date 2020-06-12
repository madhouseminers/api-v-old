import db from "../../../db";
import { AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";

interface IValidateResetTokenParams {
  token: string;
}

interface ResetToken {
  key: string;
}

export default async (_: any, args: IValidateResetTokenParams) => {
  let tokenDetails: ResetToken;
  try {
    // validate token
    tokenDetails = jwt.verify(
      args.token,
      process.env.JWT_KEY as string
    ) as ResetToken;
  } catch (e) {
    throw new AuthenticationError("Invalid Token Provided");
  }

  const results = await db.query("select email from users where reset_key=$1", [
    tokenDetails.key,
  ]);

  if (results.rowCount !== 1) {
    throw new AuthenticationError("Invalid Token Provided");
  }

  return results.rows[0].email;
};

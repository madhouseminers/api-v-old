import db from "../../../db";
import { AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";

interface IValidateResetTokenParams {
  token: string;
  password: string;
  confirmPassword: string;
}

interface VerifyToken {
  key: string;
}

export default async (_: any, args: IValidateResetTokenParams) => {
  let tokenDetails: VerifyToken;
  try {
    // validate token
    tokenDetails = jwt.verify(
      args.token,
      process.env.JWT_KEY as string
    ) as VerifyToken;
  } catch (e) {
    throw new AuthenticationError("Invalid Token Provided");
  }

  const results = await db.query("select * from users where register_key=$1", [
    tokenDetails.key,
  ]);

  if (results.rowCount !== 1) {
    throw new AuthenticationError("Invalid Token Provided");
  }
  const user = results.rows[0];
  await db.query("update users set register_key=''");
  await db.query("update whitelists set status='SUBMITTED' where user_id=$1", [
    user.id,
  ]);

  const token = jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_KEY as string,
    {
      issuer: "mhm-api",
      expiresIn: "6h",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.display,
      reviewer: user.reviewer,
    },
  };
};

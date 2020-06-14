import db from "../../../db";
import { AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import argon from "argon2";
import * as randomstring from "randomstring";

interface IValidateResetTokenParams {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ResetToken {
  key: string;
}

interface IErrors {
  password?: string;
  confirmPassword?: string;
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

  let errors: IErrors = {};

  /* Password */
  if (!args.password.length) {
    errors.password = "Password is required";
  }

  /* Confirm Password */
  if (!args.confirmPassword.length) {
    errors.confirmPassword = "Confirmation password is required";
  } else if (args.password.length && args.password !== args.confirmPassword) {
    // are the password and confPassword different?
    errors.confirmPassword = "Password and Confirmation password do not match";
  }

  if (errors.password || errors.confirmPassword) {
    throw new Error(JSON.stringify(errors));
  }

  const results = await db.query("select * from users where reset_key=$1", [
    tokenDetails.key,
  ]);

  if (results.rowCount !== 1) {
    throw new AuthenticationError("Invalid Token Provided");
  }
  const user = results.rows[0];
  const hashedPassword = await argon.hash(args.password, {
    salt: new Buffer(randomstring.generate(32)),
  });
  await db.query("update users set password=$1, reset_key='' where id=$2", [
    hashedPassword,
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

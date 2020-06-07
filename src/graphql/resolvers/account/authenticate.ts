import db from "../../../db";
import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IAuthenticateParams {
  email: string;
  password: string;
}

export default async (_: any, args: IAuthenticateParams) => {
  const results = await db.query("select * from users where email=$1", [
    args.email,
  ]);

  if (results.rowCount !== 1) {
    throw new AuthenticationError("Invalid e-mail address or password");
  }

  const user = results.rows[0];
  if (!(await bcrypt.compare(args.password, user.password))) {
    throw new AuthenticationError("Invalid e-mail address or password");
  }

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
    },
  };
};

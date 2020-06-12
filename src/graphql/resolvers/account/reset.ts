import db from "../../../db";
import { AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { sendMail } from "../../../email/send";

interface IAuthenticateParams {
  email: string;
  password: string;
}

export default async (_: any, args: IAuthenticateParams) => {
  const results = await db.query(
    "select id, email, display from users where email=$1",
    [args.email]
  );

  if (results.rowCount !== 1) {
    throw new AuthenticationError("The e-mail address provided does not exist");
  }

  const user = results.rows[0];
  const key = randomstring.generate(16);
  const token = jwt.sign({ key }, process.env.JWT_KEY as string, {
    expiresIn: "1h",
  });

  await db.query("update users set reset_key=$1 where id=$2", [key, user.id]);

  await sendMail("reset", "Your password reset link is here!", user, token);

  return true;
};

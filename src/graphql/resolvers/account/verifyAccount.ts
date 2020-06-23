import db from "../../../db";
import { AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import { pubsub, WHITELIST_UPDATED } from "../index";

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
  const whitelist = await db.query(
    "update whitelists set status='SUBMITTED' where user_id=$1 returning where_heard,modded_experience,known_members,interested_servers,about_user,id",
    [user.id]
  );

  const newWhitelist = {
    dob: user.dob.toISOString(),
    displayName: user.display,
    status: "SUBMITTED",
    minecraftuuid: user.minecraftuuid,
    whereHeard: whitelist.rows[0].where_heard,
    moddedExperience: whitelist.rows[0].modded_experience,
    knownMembers: whitelist.rows[0].known_members,
    interestedServers: whitelist.rows[0].interested_servers,
    aboutUser: whitelist.rows[0].about_user,
    id: whitelist.rows[0].id,
  };
  await pubsub.publish(WHITELIST_UPDATED, {
    whitelistUpdated: newWhitelist,
  });

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

import { AuthenticationError } from "apollo-server-express";
import { requiresAuth } from "../../wrappers/auth";
import db from "../../../db";

async function handler(parent: any, args: any, context: { user: any }) {
  if (
    !context.user ||
    (args.id &&
      context.user.id !== parseInt(args.id, 10) &&
      !context.user.reviewer)
  ) {
    throw new AuthenticationError("Invalid token provided");
  }

  const results = await db.query(
    "select id, status, submitted, reviewer_feedback, where_heard, modded_experience, known_members, interested_servers, about_user from whitelists where user_id=$1 order by submitted desc limit 1",
    [args.id??context.user.id]
  );

  let whitelist = {
    status: "NONE",
    feedback: "",
    whereHeard: "",
    moddedExperience: "",
    knownMembers: "",
    interestedServers: "",
    aboutUser: "",
    id: 0,
    submitted: "",
  };

  if (results.rowCount == 1) {
    whitelist.id = results.rows[0].id;
    whitelist.status = results.rows[0].status;
    whitelist.feedback = results.rows[0].reviewer_feedback;
    whitelist.whereHeard = results.rows[0].where_heard;
    whitelist.moddedExperience = results.rows[0].modded_experience;
    whitelist.knownMembers = results.rows[0].known_members;
    whitelist.interestedServers = results.rows[0].interested_servers;
    whitelist.aboutUser = results.rows[0].about_user;
    whitelist.submitted = results.rows[0].submitted.toISOString();
  }

  return {
    dob: context.user.dob.toISOString(),
    displayName: context.user.display,
    minecraftuuid: context.user.minecraftuuid,
    ...whitelist,
  };
}

export default requiresAuth(handler);

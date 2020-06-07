import { AuthenticationError } from "apollo-server-express";
import { requiresAuth } from "../../wrappers/auth";
import db from "../../../db";

async function handler(parent: any, args: any, context: { user: any }) {
  if (!context.user) {
    throw new AuthenticationError("Invalid token provided");
  }

  const results = await db.query(
    "select id, status, reviewer_feedback, where_heard, modded_experience, known_members, interested_servers, about_user from whitelists where user_id=$1 order by submitted desc limit 1",
    [context.user.id]
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
  }

  return {
    dob: context.user.dob.toISOString(),
    displayName: context.user.display,
    ...whitelist,
  };
}

export default requiresAuth(handler);

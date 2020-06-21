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

  let results;

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
    dob: "",
    displayName: "",
    minecraftuuid: "",
  };

  if (args.id) {
    results = await db.query(
      "select id, user_id, status, submitted, reviewer_feedback, where_heard, modded_experience, known_members, interested_servers, about_user from whitelists where id=$1 order by submitted desc limit 1",
      [args.id]
    );
    let user = await db.query("select dob, display, minecraftuuid from users where id=$1", [results.rows[0].user_id]);
    whitelist.dob = user.rows[0].dob;
    whitelist.displayName = user.rows[0].display;
    whitelist.minecraftuuid = user.rows[0].minecraftuuid;
  } else {
    results = await db.query(
      "select id, status, submitted, reviewer_feedback, where_heard, modded_experience, known_members, interested_servers, about_user from whitelists where user_id=$1 order by submitted desc limit 1",
      [context.user.id]
    );
    whitelist.dob = context.user.dob.toISOString();
    whitelist.displayName = context.user.display;
    whitelist.minecraftuuid =context.user.minecraftuuid;
  }

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
    ...whitelist,
  };
}

export default requiresAuth(handler);

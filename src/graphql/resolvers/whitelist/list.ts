import { AuthenticationError } from "apollo-server-express";
import { requiresAuth } from "../../wrappers/auth";
import db from "../../../db";

async function handler(parent: any, args: any, context: { user: any }) {
  if (!context.user) {
    throw new AuthenticationError("Invalid token provided");
  }

  const results = await db.query(
    "select w.id, w.submitted, w.user_id, w.status, w.reviewer_feedback, w.where_heard, w.modded_experience, w.known_members, w.interested_servers, w.about_user, u.minecraftuuid, u.dob, u.display from whitelists w join users u on (w.user_id = u.id) order by w.submitted desc"
  );

  return results.rows.map((row) => ({
    minecraftuuid: context.user.minecraftuuid,
    dob: row.dob.toISOString(),
    displayName: row.display,
    id: row.id,
    status: row.status,
    feedback: row.reviewer_feedback,
    whereHeard: row.where_heard,
    moddedExperience: row.modded_experience,
    knownMembers: row.known_members,
    interestedServers: row.interested_servers,
    aboutUser: row.about_user,
    submitted: row.submitted.toISOString(),
  }));
}

export default requiresAuth(handler, true);

import db from "../../../db";
import { requiresAuth } from "../../wrappers/auth";
import { pubsub, WHITELIST_UPDATED } from "../index";
import { sendMail } from "../../../email/send";

interface IUpdateWhitelistParams {
  id: string;
  outcome: string;
  feedback: string;
}

interface IErrors {
  feedback?: string;
}

const review = async (
  _: any,
  args: IUpdateWhitelistParams,
  context: { user: any }
) => {
  let errors: IErrors = {};

  if (!args.feedback.length) {
    errors.feedback = "This field is required";
  }

  if (errors.feedback) {
    throw new Error(JSON.stringify(errors));
  }

  await db.query(
    "update whitelists set reviewed=current_timestamp, reviewer_id=$1, status=$2, reviewer_feedback=$3 where id=$4",
    [context.user.id, args.outcome, args.feedback, args.id]
  );
  const result = await db.query(
    "select w.id, w.submitted, w.user_id, w.status, w.reviewer_feedback, w.where_heard, w.modded_experience, w.known_members, w.interested_servers, w.about_user, u.minecraftuuid, u.dob, u.display from whitelists w join users u on (w.user_id = u.id) order by w.submitted desc"
  );

  const newWhitelist = {
    dob: result.rows[0].dob.toISOString(),
    displayName: result.rows[0].display,
    minecraftuuid: result.rows[0].minecraftuuid,
    id: result.rows[0].id,
    status: result.rows[0].status,
    feedback: result.rows[0].reviewer_feedback,
    whereHeard: result.rows[0].where_heard,
    moddedExperience: result.rows[0].modded_experience,
    knownMembers: result.rows[0].known_members,
    interestedServers: result.rows[0].interested_servers,
    aboutUser: result.rows[0].about_user,
    submitted: result.rows[0].submitted.toISOString(),
  };

  await sendMail(
    args.outcome,
    "Your whitelist application has been reviewed!",
    context.user,
    args.feedback
  );

  await pubsub.publish(WHITELIST_UPDATED, {
    whitelistUpdated: newWhitelist,
  });

  return newWhitelist;
};

export default requiresAuth(review, true);

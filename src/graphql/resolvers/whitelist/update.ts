import db from "../../../db";
import { requiresAuth } from "../../wrappers/auth";
import { pubsub, WHITELIST_UPDATED } from "../index";
import { sendMail } from "../../../email/send";

interface IUpdateWhitelistParams {
  whereHeard: string;
  moddedExperience: string;
  knownMembers: string;
  interestedServers: string;
  aboutUser: string;
  id: string;
}

interface IErrors {
  whereHeard?: string;
  moddedExperience?: string;
  knownMembers?: string;
  interestedServers?: string;
  aboutUser?: string;
}

const update = async (
  _: any,
  args: IUpdateWhitelistParams,
  context: { user: any }
) => {
  let errors: IErrors = {};

  if (!args.whereHeard.length) {
    errors.whereHeard = "This field is required";
  }
  if (!args.moddedExperience.length) {
    errors.moddedExperience = "This field is required";
  }
  if (!args.knownMembers.length) {
    errors.knownMembers = "This field is required";
  }
  if (!args.interestedServers.length) {
    errors.interestedServers = "This field is required";
  }
  if (!args.aboutUser.length) {
    errors.aboutUser = "This field is required";
  }

  if (
    errors.whereHeard ||
    errors.moddedExperience ||
    errors.knownMembers ||
    errors.interestedServers ||
    errors.aboutUser
  ) {
    throw new Error(JSON.stringify(errors));
  }

  await db.query(
    "update whitelists set where_heard=$1, modded_experience=$2, known_members=$3, interested_servers=$4, about_user=$5, submitted=current_timestamp, status='SUBMITTED' where id=$6",
    [
      args.whereHeard,
      args.moddedExperience,
      args.knownMembers,
      args.interestedServers,
      args.aboutUser,
      args.id,
    ]
  );

  const newWhitelist = {
    dob: context.user.dob.toISOString(),
    displayName: context.user.display,
    status: "SUBMITTED",
    minecraftuuid: context.user.minecraftuuid,
    ...args,
  };

  await sendMail(
    "submitted",
    "Your whitelist application has been received!",
    context.user
  );

  await pubsub.publish(WHITELIST_UPDATED, {
    whitelistUpdated: newWhitelist,
  });

  return newWhitelist;
};

export default requiresAuth(update);

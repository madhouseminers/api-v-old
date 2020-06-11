import db from "../../../db";
import moment from "moment";
import request from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../../../email/send";

interface IRegisterParams {
  email: string;
  password: string;
  confPassword: string;
  minecraftName: string;
  dob: string;
  whereHeard: string;
  moddedExperience: string;
  knownMembers: string;
  interestedServers: string;
  aboutUser: string;
}

interface IErrors {
  email?: string;
  password?: string;
  confPassword?: string;
  minecraftName?: string;
  dob?: string;
  whereHeard?: string;
  moddedExperience?: string;
  knownMembers?: string;
  interestedServers?: string;
  aboutUser?: string;
}

async function isEmailRegistered(email: string): Promise<boolean> {
  return (
    (await db.query("select id from users where email=$1", [email]))
      .rowCount !== 0
  );
}

async function fetchMinecraftUUID(
  minecraftName: string
): Promise<string | null> {
  const response = await request.get(
    `https://api.mojang.com/users/profiles/minecraft/${minecraftName}`
  );
  if (response.status !== 200) {
    return null;
  }
  return response.data.id;
}

async function mcAccountAlreadyRegistered(uuid: string): Promise<boolean> {
  return (
    (await db.query("select id from users where minecraftuuid=$1", [uuid]))
      .rowCount !== 0
  );
}

export default async (_: any, args: IRegisterParams) => {
  let errors: IErrors = {};

  /* E-mail Address */
  if (!args.email.length) {
    errors.email = "E-mail address is required";
  } else if (await isEmailRegistered(args.email)) {
    // is the e-mail address already registered?
    errors.email = "E-mail address is already in use";
  }

  /* Password */
  if (!args.password.length) {
    errors.password = "Password is required";
  }

  /* Confirm Password */
  if (!args.confPassword.length) {
    errors.confPassword = "Confirmation password is required";
  } else if (args.password.length && args.password !== args.confPassword) {
    // are the password and confPassword different?
    errors.confPassword = "Password and Confirmation password do not match";
  }

  /* Minecraft Name */
  let mcUUID;
  if (!args.minecraftName.length) {
    errors.minecraftName = "Minecraft name is required";
  } else if (!(mcUUID = await fetchMinecraftUUID(args.minecraftName))) {
    // is the minecraft name valid?
    errors.minecraftName = "The minecraft account provided is not valid";
  } else if (await mcAccountAlreadyRegistered(mcUUID)) {
    // is the minecraft account already registered?
    errors.minecraftName = "This minecraft account is already in use";
  }

  /* Date of Birth */
  if (!args.dob.length) {
    errors.dob = "Date of Birth is required";
  } else if (moment().diff(moment(args.dob), "years") < 13) {
    // is the DoB less than 13 years ago?
    errors.dob = "You are too young to register on this site";
  }

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
    errors.email ||
    errors.password ||
    errors.confPassword ||
    errors.minecraftName ||
    errors.dob ||
    errors.whereHeard ||
    errors.moddedExperience ||
    errors.knownMembers ||
    errors.interestedServers ||
    errors.aboutUser
  ) {
    throw new Error(JSON.stringify(errors));
  }

  // Register the user here
  const hashedPassword = await bcrypt.hash(args.password, 12);
  const results = await db.query(
    "insert into users (email, password, minecraftuuid, dob, display) values ($1, $2, $3, $4, $5) returning id",
    [args.email, hashedPassword, mcUUID, args.dob, args.minecraftName]
  );
  const id = results.rows[0].id;
  await db.query(
    "insert into whitelists (user_id, where_heard, modded_experience, known_members, interested_servers, about_user, submitted, status) values ($1, $2, $3, $4, $5, $6, current_timestamp, 'SUBMITTED')",
    [
      id,
      args.whereHeard,
      args.moddedExperience,
      args.knownMembers,
      args.interestedServers,
      args.aboutUser,
    ]
  );

  const token = jwt.sign(
    {
      sub: id,
    },
    process.env.JWT_KEY as string,
    {
      issuer: "mhm-api",
      expiresIn: "6h",
    }
  );

  await sendMail("submitted", "Your whitelist application has been received!", {
    email: args.email,
    display: args.minecraftName,
  });

  return {
    token,
    user: {
      id: id,
      email: args.email,
      displayName: args.minecraftName,
      reviewer: false,
    },
  };
};

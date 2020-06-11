import * as nodemailer from "nodemailer";
import { resolve } from "path";
import { readFileSync } from "fs";

interface IUser {
  email: string;
  display: string;
}

export async function sendMail(
  email: string,
  subject: string,
  user: IUser,
  feedback?: string
) {
  console.log(email);
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const textEmail = readFileSync(resolve(__dirname, `../../dist/${email}.txt`))
    .toString()
    .replace("{displayname}", user.display)
    .replace("{comment}", feedback ?? "")
    .replace(new RegExp(/%7Bbase_url%7D/g), process.env.BASE_URL ?? "");
  const htmlEmail = readFileSync(resolve(__dirname, `../../dist/${email}.html`))
    .toString()
    .replace("{displayname}", user.display)
    .replace("{comment}", feedback ?? "")
    .replace(new RegExp(/%7Bbase_url%7D/g), process.env.BASE_URL ?? "");

  await transporter.sendMail({
    from: '"Madhouse Miners" <support@madhouseminers.com>',
    to: `${user.display} <${user.email}>`,
    subject: subject, // Subject line
    text: textEmail,
    html: htmlEmail,
  });
}

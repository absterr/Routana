import { Resend } from "resend";
import env from "./env.js";

const resend = new Resend(env.RESEND_API_KEY);

interface Params {
  to: string;
  subject: string;
  template: string;
  url?: string;
  newEmail?: string;
}

export const sendMail = async ({ to, subject, template, url, newEmail }: Params) => {
  let html = template;
  if (newEmail) {
     html = html.replace("{{newEmail}}", newEmail)
  };
  if (url) {
    html = html.replace("{URL}", url)
  };

  try {
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: to.toLowerCase().trim(),
      subject: subject.trim(),
      html
    });
    if (error) return error;
    return data;
  } catch (error) {
    return error;
  }
};

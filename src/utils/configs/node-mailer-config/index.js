import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Mail,
    pass: process.env.Mail_PASS,
  },
});

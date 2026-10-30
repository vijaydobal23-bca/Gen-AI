
import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.APP_PASSWORD,
  },
});

transporter.verify()
  .then(() => console.log("Transporter is ready"))
  .catch((err) => console.log("Nodemailer error:", err));

export const sentEmail = async (to, subject, html, text) => {
  try {
    if (!to) {
      throw new Error("Recipient email is missing");
    }

    const info = await transporter.sendMail({
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text,
    });

    console.log("Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (err) {
    console.log("Email sending error:", err);
    throw err;
  }
};

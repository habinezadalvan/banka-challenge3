import nodemailer from 'nodemailer';
import { ApolloError } from 'apollo-server-express';
import { mainHTML } from './mainMailerHTML';

const { NODE_MAILER_USER, NODE_MAILER_PASSWORD, NODE_ENV } = process.env;

export const sendEmail = async (email, subject, message) => {
  const mainHtml = mainHTML(message);
  try {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: NODE_MAILER_USER,
        pass: NODE_MAILER_PASSWORD,
      },
    });
    const mailOptions = {
      from: NODE_MAILER_USER,
      to: email,
      subject,
      html: mainHtml,
    };
    return NODE_ENV === 'test' ? true : await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ApolloError(`This has occured during when sending email, ${err}`);
  }
};

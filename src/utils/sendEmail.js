import nodemailer from 'nodemailer';
import { ApolloError } from 'apollo-server-express';

const { NODE_MAILER_USER, NODE_MAILER_PASSWORD, NODE_ENV } = process.env;


export const sendEmail = async (email, subject, message) => {
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
      html: `<div style="background:#ECF0F1;width:100%;padding:20px 0;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff" font-size:1.2em>
      <div style="background:#266cef;padding:10px;color:#ffffff;text-align:center;font-size:34px">
      LIG
      </div>
      <div style="padding:20px;text-align:left;color:black" font-family: verdana>
      ${message}
      </div>
      </div>
      <div style="padding:30px 10px;text-align:center;">
      Copyright &copy; 2020
      </div>
      </div>`,
    };
    return (NODE_ENV === 'test') ? true : await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ApolloError(`This has occured during when sending email, ${err}`);
  }
};

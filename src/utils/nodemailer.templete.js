import { generateToken } from '../helpers/user.helpers';

const { BASE_URL } = process.env;

export const messageTemplate = async (data, action, text) => {
  const token = await generateToken(data);
  const link = `${BASE_URL}/${action}/${token}`;
  const message = `
  <h2>Hello ${data.userName}</h2> </br>
  ${text}
  <br>
  <br><br><br>
  <a href='${link}' style="margin:35px 0;padding:15px 35px;background:#266cef;color:#ffffff;clear:both;border-radius:30px;text-decoration:none" target='_blank'>${action}</a>
  `;
  return message;
};

import { verify } from 'jsonwebtoken';
import models from '../../sequelize/models';
import {
  generateToken,
  sendRefreshTokenAsCookie,
} from '../../helpers/user.helpers';

const {
  REFRESH_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = process.env;

export const refreshToken = async (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload = null;

  try {
    payload = await verify(token, REFRESH_TOKEN_SECRET_KEY);
  } catch (err) {
    return res.send({ ok: false, accessToken: '' });
  }

  const user = await models.User.findOne({ where: { id: payload.id } });

  if (!user || user.dataValues.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  const { password, ...rest } = user.dataValues;

  const refreshTkn = await generateToken(
    rest,
    REFRESH_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_EXPIRES_IN,
  );

  sendRefreshTokenAsCookie(res, refreshTkn);

  return res.send({
    ok: true,
    accessToken: await generateToken(
      rest,
      ACCESS_TOKEN_SECRET_KEY,
      ACCESS_TOKEN_EXPIRES_IN,
    ),
  });
};

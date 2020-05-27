import { ApolloError, ForbiddenError } from 'apollo-server-express';
import { hashSync, compareSync } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import '@babel/polyfill';
import 'dotenv/config';

const { ACCESS_TOKEN_SECRET_KEY } = process.env;

export const hashPassword = async (password) => hashSync(password, 10);

export const comparePassword = async (
  password,
  hashedPassword,
) => compareSync(password, hashedPassword);

export const generateToken = async (payload, secretKey, exp) => sign(payload, secretKey, { expiresIn: `${exp}` });
export const decodeToken = async (token) => {
  let user;
  await verify(token, ACCESS_TOKEN_SECRET_KEY, (error, decoded) => {
    if (error) {
      throw new ApolloError('Please login to proceed!!');
    } else {
      if (decoded.accountStatus === 'disactivated') throw new ForbiddenError('Your account was disactivated');
      user = decoded;
    }
  });
  return user;
};

export const sendRefreshTokenAsCookie = async (res, refreshToken) => {
  res.cookie('jid', refreshToken, { httpOnly: true });
};

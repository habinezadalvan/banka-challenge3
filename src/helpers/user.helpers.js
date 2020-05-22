import { ApolloError, ForbiddenError } from 'apollo-server-express';
import { hashSync, compareSync } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import '@babel/polyfill';
import 'dotenv/config';

const { JWT_SECRET_KEY } = process.env;

export const hashPassword = async (password) => hashSync(password, 10);

export const comparePassword = async (
  password,
  hashedPassword,
) => compareSync(password, hashedPassword);

export const generateToken = async (payload) => sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
export const decodeToken = async (token) => {
  let user;
  await verify(token, JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      throw new ApolloError('Please login to proceed!!');
    } else {
      if (decoded.accountStatus === 'disactivated') throw new ForbiddenError('Your account was disactivated');
      user = decoded;
    }
  });
  return user;
};

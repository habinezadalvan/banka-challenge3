import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET_KEY } = process.env;

export const hashPassword = async (password) => bcrypt.hashSync(password, 10);

export const comparePassword = async (password, hashedPassword) => bcrypt
  .compareSync(password, hashedPassword);

export const generateToken = async (payload) => jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
export const decodeToken = async (token) => {
  let user;
  await jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      throw new ApolloError('Please login to proceed!!');
    }
    user = decoded;
  });
  return user;
};

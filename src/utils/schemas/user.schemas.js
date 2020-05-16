/* eslint-disable no-useless-escape */
import Joi from '@hapi/joi';


export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required().trim(),
  password: Joi.string().required(),
});
const matchRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
export const createUserSchema = Joi.object().keys({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  userName: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().regex(matchRegex).required(),
  avatar: Joi.string(),
  roleId: Joi.number(),
  phoneNo: Joi.string(),
});

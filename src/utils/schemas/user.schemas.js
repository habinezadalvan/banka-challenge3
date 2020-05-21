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

export const updateUserSchema = Joi.object().keys({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  userName: Joi.string().trim(),
  email: Joi.string().email().trim(),
  avatar: Joi.string(),
  roleId: Joi.number(),
  phoneNo: Joi.string(),
  accountStatus: Joi.string().trim(),
  positionId: Joi.number(),
  savingsId: Joi.number(),
  positionStatus: Joi.number(),
});

export const resetForgotPasswordSchema = Joi.object().keys({
  password: Joi.string().regex(matchRegex),
});

export const resetPasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().regex(matchRegex),
  comparePassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

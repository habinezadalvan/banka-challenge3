import Joi from '@hapi/joi';

export const contributionSchema = Joi.object().keys({
  amount: Joi.number().required(),
  paymentOption: Joi.string(),
  contributionOfMonthOf: Joi.string().required(),
});

export const updateContributionSchema = Joi.object().keys({
  amount: Joi.number(),
  paymentOption: Joi.string(),
  contributionOfMonthOf: Joi.string(),
});

import Joi from '@hapi/joi';

export const contributionSchema = Joi.object().keys({
  amount: Joi.number().required(),
  paymentOptions: Joi.string(),
  contributionOfMonthOf: Joi.string().required(),
});

export const updateContributionSchema = Joi.object().keys({
  amount: Joi.number(),
  paymentOptions: Joi.string(),
  contributionOfMonthOf: Joi.string(),
});

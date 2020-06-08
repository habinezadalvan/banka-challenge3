import Joi from '@hapi/joi';

export const contributionSchema = Joi.object().keys({
  amount: Joi.number().required(),
  paymentOptions: Joi.string(),
  contributionOfMonthOf: Joi.string().required(),
  bankReceipt: Joi.string(),
});

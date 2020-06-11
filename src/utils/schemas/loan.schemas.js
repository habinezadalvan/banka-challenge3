import Joi from '@hapi/joi';

export const loanSchema = Joi.object().keys({
  amount: Joi.number().required(),
  paymentDeadLine: Joi.string().required(),
});

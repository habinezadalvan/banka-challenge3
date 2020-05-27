import jwt from 'jsonwebtoken';
import models from '../../sequelize/models';

const { ACCESS_TOKEN_SECRET_KEY, BASE_URL } = process.env;


export const verifyMyAccount = async (req, res) => {
  try {
    const { email } = await jwt.verify(req.params.token, ACCESS_TOKEN_SECRET_KEY);
    await models.User.update({ verified: true }, { where: { email } });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: 'Sorry, your account was not verified. Please contact the admin.',
    });
  }
  return res.redirect(`${BASE_URL}/graphql/login`);
};

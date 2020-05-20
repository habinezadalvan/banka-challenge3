import jwt from 'jsonwebtoken';
import { generalValidator } from '../../helpers/general.validator';
import { resetForgotPasswordSchema } from '../../utils/schemas/user.schemas';
import models from '../../sequelize/models';
import { hashPassword } from '../../helpers/user.helpers';

const { JWT_SECRET_KEY } = process.env;
export const forgotPassword = async (req, res) => {
  try {
    const { email } = await jwt.verify(req.params.token, JWT_SECRET_KEY);
    const { password } = req.body;
    await generalValidator({ password }, resetForgotPasswordSchema);
    const hashedPassword = await hashPassword(password);
    await models.User.update({ password: hashedPassword }, { where: { email } });
    return res.status(200).json({
      status: 200,
      message: 'Password reset was done successfully!',
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: `${err.message}`,
    });
  }
};

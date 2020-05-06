import { User } from '../../services/user.service';
import { generalValidator } from '../../helpers/general.validator';
import { loginSchema } from '../../utils/schemas/user.schemas';

export const userResolver = {
  Mutation: {
    userLogin: async (_, { input }) => {
      generalValidator(input, loginSchema);
      const loggingIn = new User(input);
      const token = await loggingIn.login();
      return { token };
    },
  },
};

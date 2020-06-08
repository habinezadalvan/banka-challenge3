import { Contribution } from '../../services/contribution.services';
import { generalValidator } from '../../helpers/general.validator';
import { contributionSchema } from '../../utils/schemas/contribution.schemas';
import { decodeToken } from '../../helpers/user.helpers';

export const contributionResolver = {
  Mutation: {
    addContribution: async (_, { input, file }, { token }) => {
      const loggedInUser = await decodeToken(token);
      await generalValidator(input, contributionSchema);
      const contribution = new Contribution(input);
      const results = contribution.payContribution(loggedInUser, file);
      return results;
    },

  },
};

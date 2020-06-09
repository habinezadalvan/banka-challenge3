import { Contribution } from '../../services/contribution.services';
import { generalValidator } from '../../helpers/general.validator';
import { contributionSchema } from '../../utils/schemas/contribution.schemas';
import { decodeToken } from '../../helpers/user.helpers';
import { isSecretaryOrFinance } from '../../utils/user.utils';

export const contributionResolver = {
  Mutation: {
    addContribution: async (_, { input, file }, { token }) => {
      const loggedInUser = await decodeToken(token);
      await generalValidator(input, contributionSchema);
      const contribution = new Contribution(input);
      const results = contribution.payContribution(loggedInUser, file);
      return results;
    },
    approveContribution: async (_, { id }, { token }) => {
      const user = await decodeToken(token);
      isSecretaryOrFinance(user);
      const approve = new Contribution({});

      const results = await approve.approveContribution(id, user);

      return results;
    },
  },
};

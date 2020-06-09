import { Contribution } from '../../services/contribution.services';
import { generalValidator } from '../../helpers/general.validator';
import { contributionSchema, updateContributionSchema } from '../../utils/schemas/contribution.schemas';
import { decodeToken } from '../../helpers/user.helpers';
import { isSecretaryOrFinance } from '../../utils/user.utils';
import { SecretaryAndFinance } from '../../services/secretaryAndFinance.service';


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
      const approve = new SecretaryAndFinance({});
      const results = await approve.contributionUpdate(id, user);

      return results;
    },
    updateContribution: async (_, { id, input, file }, { token }) => {
      const user = await decodeToken(token);
      await generalValidator(input, updateContributionSchema);
      const updateContribution = new Contribution({});
      const results = await updateContribution.contributionUpdate(id, user, input, file);
      return results;
    },
  },
};

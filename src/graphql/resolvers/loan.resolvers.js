import { decodeToken } from '../../helpers/user.helpers';
import { Loan } from '../../services/loan.services';
import { isAdmin, isLoanManager } from '../../utils/user.utils';
import { Admin } from '../../services/admin.service';
import { generalValidator } from '../../helpers/general.validator';
import { loanSchema } from '../../utils/schemas/loan.schemas';


export const loanResolvers = {
  Query: {
    fetchLoan: async (_, { id }, { token }) => {
      await decodeToken(token);
      const loan = new Loan({});
      const results = loan.getLoan(id);
      return results;
    },
  },

  Mutation: {
    addLoan: async (_, { input }, { token }) => {
      const loggedInUser = await decodeToken(token);
      await generalValidator(input, loanSchema);
      const loan = new Loan(input);
      const results = loan.loanRequest(loggedInUser);
      return results;
    },
    changeInterestRate: async (_, { rate }, { token }) => {
      const loggedInUser = await decodeToken(token);
      await isAdmin(loggedInUser);
      const interestRate = new Admin({});
      const results = interestRate.updateLoanInterestRate(rate);
      return results;
    },
    updateLoan: async (_, { id, input }, { token }) => {
      const loggedInUser = await decodeToken(token);
      const loanUpdate = new Loan(input);
      const results = loanUpdate.updateLoan(id, loggedInUser);
      return results;
    },
    approveLoan: async (_, { id }, { token }) => {
      const loggedInUser = await decodeToken(token);
      await isLoanManager(loggedInUser);
      const approvedLoan = new Loan({});
      const results = approvedLoan.approvingLoan(id, loggedInUser);
      return results;
    },
  },
};

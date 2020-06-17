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
    changeRatings: async (_, { input }, { token }) => {
      const loggedInUser = await decodeToken(token);
      await isAdmin(loggedInUser);
      const interestRate = new Admin({});
      const results = interestRate.changeLoanRatings(input);
      return results;
    },
    modifyLoan: async (_, { id, input }, { token }) => {
      const loggedInUser = await decodeToken(token);
      const loanUpdate = new Loan(input);
      const results = loanUpdate.modifyLoan(id, loggedInUser);
      return results;
    },
    updateLoan: async (_, { input }, { token }) => {
      const loggedInUser = await decodeToken(token);
      await isLoanManager(loggedInUser);
      const updatedLoan = new Loan({});
      const results = updatedLoan.updateLoan(input, loggedInUser);
      return results;
    },
    payLoan: async (_, { id, input, file }, { token }) => {
      const loggedInUser = await decodeToken(token);
      const payLoan = new Loan(input);
      const results = payLoan.payingLoan(id, file, loggedInUser);
      return results;
    },
    deleteLoan: async (_, { id }, { token }) => {
      const user = await decodeToken(token);
      const loan = new Loan({});
      const results = loan.deleteLoan(id, user);
      return results;
    },
  },
};

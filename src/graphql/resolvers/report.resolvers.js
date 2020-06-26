import { decodeToken } from '../../helpers/user.helpers';
import { Report } from '../../services/report.services';

export const reportResolvers = {
  Mutation: {
    addReport: async (_, { input, file }, { token }) => {
      await decodeToken(token);
      const report = new Report(input);
      const results = report.createReport(file);
      return results;
    },
  },
};

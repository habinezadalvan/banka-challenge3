import { userResolver } from './user.resolver';
import { contributionResolver } from './contribution.resolver';
import { loanResolvers } from './loan.resolvers';

export const resolvers = [userResolver, contributionResolver, loanResolvers];

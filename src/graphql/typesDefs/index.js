import { allMutations } from './mutations/index';
import { allQueries } from './queries/index';
import { allTypes } from './types/index';

export const typeDefs = [
  allQueries.userQueries,
  allQueries.contributionQueries,
  allQueries.loanQueris,
  allMutations.userMutations,
  allMutations.contributionMutation,
  allMutations.loanMutations,
  allMutations.reportMutations,
  allTypes.userTypes,
  allTypes.roleTypes,
  allTypes.positionTypes,
  allTypes.savingTypes,
  allTypes.contributionTypes,
  allTypes.reportTypes,
  allTypes.voteTypes,
  allTypes.votingEventsTypes,
  allTypes.eventsTypes,
  allTypes.loanTypes,
  allTypes.fileType,
];

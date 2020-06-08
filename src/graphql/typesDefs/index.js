import { allMutations } from './mutations/index';
import { allQueries } from './queries/index';
import { allTypes } from './types/index';

export const typeDefs = [
  allQueries.userQueries,
  allMutations.userMutations,
  allMutations.contributionMutation,
  allTypes.userTypes,
  allTypes.roleTypes,
  allTypes.positionTypes,
  allTypes.savingTypes,
  allTypes.contributionTypes,
  allTypes.reportTypes,
  allTypes.voteTypes,
  allTypes.votingEventsTypes,
  allTypes.eventsTypes,
];

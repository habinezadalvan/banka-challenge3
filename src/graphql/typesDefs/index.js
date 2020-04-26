import { allMutations } from './mutations/index';
import { allQueries } from './queries/index';
import { allTypes } from './types/index';

export const typeDefs = [
  allQueries.userQueries,
  allMutations.userMutations,
  allTypes.userType,
];

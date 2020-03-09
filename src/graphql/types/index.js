import {queries} from './queries';
// import { allMutations } from './mutations';
import {userType} from './user.typeDefs';
import {mutation} from './mutations';

export const typeDefs = [
    queries,
    mutation,
    userType
]
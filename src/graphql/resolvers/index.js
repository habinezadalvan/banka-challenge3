import resolver from './user.resolver';
import {createUser} from './user.resolver.mutation'

export const resolvers = [resolver, createUser];
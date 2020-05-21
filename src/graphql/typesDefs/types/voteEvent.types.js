import { gql } from 'apollo-server-express';

export const votingEventsTypes = gql`
    enum EventStatusOptions {
        open
        closed
    }
    type VotingEvent {
        id: ID!
        votingMembers: [User]
        candidates: [User]
        startTime: String!
        closeTime: String
        status: EventStatusOptions
        notify: [User]
    }
`;

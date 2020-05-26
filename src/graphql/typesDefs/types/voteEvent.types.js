import { gql } from 'apollo-server-express';

export const votingEventsTypes = gql`
    enum EventStatusOptions {
        open
        closed
    }
    type VotingEvent {
        id: ID
        votingMembers: [String]
        candidates: [String]
        startTime: String
        closeTime: String
        status: EventStatusOptions
        notify: [User]
    }
`;

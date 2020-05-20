import { gql } from 'apollo-server-express';

export const eventsTypes = gql`
    type Event {
        id: ID!
        name: String!
        attendees: [User]
        description: String
        startTime: String!
        closeTime: String
        status: EventStatusOptions
        notify: [User]
    }
`;

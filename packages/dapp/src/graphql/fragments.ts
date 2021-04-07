import gql from 'fake-tag';

export const GrantDetails = gql`
  fragment GrantDetails on Grant {
    id
    createdBy
    timestamp
    grantees
    granteesData
    amounts
    funded
    name
    description
    link
    contactLink
    funds {
      donor
      amount
    }
    streams {
      id
      owner
      released
      funded
      withdrawn
      startTime
      revokeTime
      duration
      isRevoked
      grant {
        id
        name
      }
    }
  }
`;

export const StreamDetails = gql`
  fragment StreamDetails on Stream {
    id
    owner
    released
    funded
    withdrawn
    startTime
    duration
    isRevoked
    revokeTime
    grant {
      id
      name
    }
  }
`;

export const UserDetails = gql`
  fragment UserDetails on User {
    id
    funded
    pledged
    streamed
    withdrawn
    earned
  }
`;

export const GrantName = gql`
  fragment GrantName on Grant {
    id
    name
  }
`;

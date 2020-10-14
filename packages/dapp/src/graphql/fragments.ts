import gql from 'fake-tag';

export const GrantDetails = gql`
  fragment GrantDetails on Grant {
    id
    createdBy
    timestamp
    grantees
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
      startTime
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
    startTime
    duration
    isRevoked
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

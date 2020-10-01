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
      owner
      released
      funded
      startTime
      duration
      isRevoked
    }
  }
`;

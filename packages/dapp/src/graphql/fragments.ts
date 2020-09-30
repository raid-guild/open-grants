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
    streams {
      released
      funded
      startTime
      duration
      isRevoked
    }
  }
`;
// funds
// payments

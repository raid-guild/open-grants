import gql from 'fake-tag';

export const GrantFragment = gql`
  fragment GrantFragment on Grant {
    id
    factoryAddress
    grantId
    grantAddress
    uri
    createBy
    grantees
    amounts
    totalFunded
    name
    description
    link
    contactLink
  }
`;
// funds
// payments

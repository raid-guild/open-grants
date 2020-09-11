import gql from 'fake-tag';

export const GrantFragment = gql`
  fragment GrantFragment on Grant {
    id
    grantAddress
    grantees
    amounts
    createBy
    uri
    totalFunded
  }
`;

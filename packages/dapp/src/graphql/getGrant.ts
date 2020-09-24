import gql from 'fake-tag';
import { client } from 'graphql/client';
import { GrantFragment } from 'graphql/fragments';

import { GetGrantQuery, GetGrantQueryVariables, Grant } from './autogen/types';

const grantQuery = gql`
  query GetGrant($address: ID!) {
    grant(id: $address) {
      ...GrantFragment
    }
  }
  ${GrantFragment}
`;

export const getGrant = async (
  address: string | undefined,
): Promise<Grant | null | undefined> => {
  if (!address) return null;

  const { data, error } = await client
    .query<GetGrantQuery, GetGrantQueryVariables>(grantQuery, {
      address,
    })
    .toPromise();

  if (!data) {
    if (error) {
      throw error;
    }

    return null;
  }
  return data.grant;
};

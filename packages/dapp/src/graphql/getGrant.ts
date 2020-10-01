import gql from 'fake-tag';
import { GetGrantQuery, GetGrantQueryVariables } from 'graphql/autogen/types';
import { client } from 'graphql/client';
import { GrantDetails } from 'graphql/fragments';
import { parseGrant } from 'graphql/utils';
import { Grant } from 'utils/types';

const grantQuery = gql`
  query GetGrant($address: ID!) {
    grant(id: $address) {
      ...GrantDetails
    }
  }
  ${GrantDetails}
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
  if (data.grant) {
    return parseGrant(data.grant, true);
  }
  return undefined;
};

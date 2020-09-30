import gql from 'fake-tag';
import { GetGrantsQuery, GetGrantsQueryVariables } from 'graphql/autogen/types';
import { client } from 'graphql/client';
import { GrantDetails } from 'graphql/fragments';
import { parseGrant } from 'graphql/utils';
import { Grant } from 'utils/grants';

const grantsQuery = gql`
  query GetGrants($first: Int) {
    grants(
      first: $first
      orderBy: timestamp
      where: { name_not: "" }
      orderDirection: desc
    ) {
      ...GrantDetails
    }
  }
  ${GrantDetails}
`;

export const getGrants = async (first = 50): Promise<Array<Grant>> => {
  const { data, error } = await client
    .query<GetGrantsQuery, GetGrantsQueryVariables>(grantsQuery, { first })
    .toPromise();

  if (!data) {
    if (error) {
      throw error;
    }

    return [];
  }

  return data.grants.map(parseGrant);
};

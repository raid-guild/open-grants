import gql from 'fake-tag';

import { GetGrantsQuery, GetGrantsQueryVariables } from './autogen/types';
import { client } from './client';
import { GrantFragment } from './fragments';

const grantsQuery = gql`
  query GetGrants($first: Int) {
    grants(first: $first) {
      ...GrantFragment
    }
  }
  ${GrantFragment}
`;

export const getGrants = async (first = 50) => {
  const { data, error } = await client
    .query<GetGrantsQuery, GetGrantsQueryVariables>(grantsQuery, { first })
    .toPromise();

  if (!data) {
    if (error) {
      throw error;
    }

    return [];
  }

  return data.grants;
};

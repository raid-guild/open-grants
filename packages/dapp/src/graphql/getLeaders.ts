import gql from 'fake-tag';
import {
  GetLeadersQuery,
  GetLeadersQueryVariables,
} from 'graphql/autogen/types';
import { client } from 'graphql/client';
import { UserDetails } from 'graphql/fragments';
import { parseUser } from 'graphql/utils';
import { User } from 'utils/types';

const leadersQuery = gql`
  query GetLeaders($first: Int) {
    users(first: $first, orderBy: funded, orderDirection: desc) {
      ...UserDetails
    }
  }
  ${UserDetails}
`;

export const getLeaders = async (first = 50): Promise<Array<User>> => {
  const { data, error } = await client
    .query<GetLeadersQuery, GetLeadersQueryVariables>(leadersQuery, {
      first,
    })
    .toPromise();

  if (!data) {
    if (error) {
      throw error;
    }

    return [];
  }

  return data.users.map(user => parseUser(user));
};

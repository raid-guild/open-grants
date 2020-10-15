import gql from 'fake-tag';
import { GetRankQuery } from 'graphql/autogen/types';
import { client } from 'graphql/client';

const rankQuery = gql`
  query GetRank {
    users(orderBy: funded, orderDirection: desc) {
      id
    }
  }
`;

export const getRank = async (address: string): Promise<number> => {
  const { data, error } = await client
    .query<GetRankQuery>(rankQuery)
    .toPromise();

  if (!data) {
    if (error) {
      throw error;
    }

    return 0;
  }

  return data.users.map(user => user.id).indexOf(address.toLowerCase()) + 1;
};

import gql from 'fake-tag';
import {
  GrantNameFragment,
  SearchQuery,
  SearchQueryVariables,
} from 'graphql/autogen/types';
import { client } from 'graphql/client';
import { GrantName } from 'graphql/fragments';
import { isAddress } from 'utils/helpers';

const searchQuery = gql`
  query Search($search: String, $first: Int) {
    grants(
      first: $first
      where: { name_contains: $search }
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...GrantName
    }
  }
  ${GrantName}
`;

const addressSearchQuery = gql`
  query AddressSearch($search: Bytes, $first: Int) {
    grants(
      first: $first
      where: { grantAddress_contains: $search }
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...GrantName
    }
    users(first: $first, where: { address_contains: $search }) {
      id
    }
  }
  ${GrantName}
`;

export type SearchResult = {
  grants: Array<GrantNameFragment>;
  users?: Array<{ id: string }>;
};

export const search = async (
  searchInput: string,
  first = 10,
): Promise<SearchResult | undefined> => {
  const isAddressSearch = isAddress(searchInput);

  const query = isAddressSearch ? addressSearchQuery : searchQuery;
  const { data, error } = await client
    .query<SearchQuery, SearchQueryVariables>(query, {
      first,
      search: isAddressSearch || searchInput,
    })
    .toPromise();

  if (!data) {
    if (error) {
      throw error;
    }

    return undefined;
  }

  return data;
};

import { getAddress } from '@ethersproject/address';
import gql from 'fake-tag';
import {
  GrantNameFragment,
  SearchQuery,
  SearchQueryVariables,
  UserNameFragment,
} from 'graphql/autogen/types';
import { client } from 'graphql/client';
import { GrantName, UserName } from 'graphql/fragments';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: string): string | false {
  try {
    return getAddress(value).toLowerCase();
  } catch {
    return false;
  }
}

const searchQuery = gql`
  query Search($search: String, $first: Int) {
    grants(first: $first, where: { name_contains: $search }) {
      ...GrantName
    }
    users(first: $first, where: { name_contains: $search }) {
      ...UserName
    }
  }
  ${UserName}
  ${GrantName}
`;

const addressSearchQuery = gql`
  query AddressSearch($search: Bytes, $first: Int) {
    grants(first: $first, where: { grantAddress_contains: $search }) {
      ...GrantName
    }
    users(first: $first, where: { address_contains: $search }) {
      ...UserName
    }
  }
  ${UserName}
  ${GrantName}
`;

export type SearchResult = {
  grants: Array<GrantNameFragment>;
  users: Array<UserNameFragment>;
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

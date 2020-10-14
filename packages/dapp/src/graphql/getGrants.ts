import { CONFIG } from 'config';
import gql from 'fake-tag';
import {
  FeaturedGrantsQuery,
  FeaturedGrantsQueryVariables,
  FundedSortedGrantsQuery,
  FundedSortedGrantsQueryVariables,
  TimeSortedGrantsQuery,
  TimeSortedGrantsQueryVariables,
} from 'graphql/autogen/types';
import { client } from 'graphql/client';
import { GrantDetails } from 'graphql/fragments';
import { parseGrant } from 'graphql/utils';
import { Grant, Sort } from 'utils/types';

const timeSortedQuery = gql`
  query TimeSortedGrants($first: Int) {
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

const fundedSortedQuery = gql`
  query FundedSortedGrants($first: Int) {
    grants(
      first: $first
      orderBy: funded
      where: { name_not: "" }
      orderDirection: desc
    ) {
      ...GrantDetails
    }
  }
  ${GrantDetails}
`;

const featuredQuery = gql`
  query FeaturedGrants($grants: [ID!]!) {
    grants(where: { name_not: "", id_in: $grants }) {
      ...GrantDetails
    }
  }
  ${GrantDetails}
`;

const fetchData = async (sort: Sort, first: number) => {
  switch (sort) {
    case Sort.Latest:
      return client
        .query<TimeSortedGrantsQuery, TimeSortedGrantsQueryVariables>(
          timeSortedQuery,
          {
            first,
          },
        )
        .toPromise();
    case Sort.Featured:
      return client
        .query<FeaturedGrantsQuery, FeaturedGrantsQueryVariables>(
          featuredQuery,
          {
            grants: CONFIG.featuredGrants,
          },
        )
        .toPromise();
    case Sort.Trending:
    default:
      return client
        .query<FundedSortedGrantsQuery, FundedSortedGrantsQueryVariables>(
          fundedSortedQuery,
          {
            first,
          },
        )
        .toPromise();
  }
};

export const getGrants = async (
  sort = Sort.Latest,
  first = 50,
): Promise<Array<Grant>> => {
  const { data, error } = await fetchData(sort, first);

  if (!data) {
    if (error) {
      throw error;
    }

    return [];
  }

  return data.grants.map(grant => parseGrant(grant));
};

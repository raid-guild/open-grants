import gql from 'fake-tag';
import {
  GetProfileQuery,
  GetProfileQueryVariables,
} from 'graphql/autogen/types';
import { client } from 'graphql/client';
import { GrantDetails, StreamDetails } from 'graphql/fragments';
import { parseProfile } from 'graphql/utils';
import { Profile } from 'utils/types';

const grantQuery = gql`
  query GetProfile($address: Bytes!, $first: Int!) {
    myGrants: grants(
      first: $first
      orderBy: timestamp
      where: { name_not: "", grantees_contains: [$address] }
      orderDirection: desc
    ) {
      ...GrantDetails
    }
    fundedGrants: grants(
      first: $first
      orderBy: timestamp
      where: { name_not: "", donors_contains: [$address] }
      orderDirection: desc
    ) {
      ...GrantDetails
    }
    streams(
      first: $first
      orderBy: timestamp
      where: { owner: $address }
      orderDirection: desc
    ) {
      ...StreamDetails
    }
  }
  ${GrantDetails}
  ${StreamDetails}
`;

export const getProfile = async (
  address: string | undefined,
  first = 50,
): Promise<Profile | null | undefined> => {
  if (!address) return null;

  const { data, error } = await client
    .query<GetProfileQuery, GetProfileQueryVariables>(grantQuery, {
      address,
      first,
    })
    .toPromise();

  if (!data) {
    if (error) {
      throw error;
    }

    return null;
  }
  return parseProfile(data);
};

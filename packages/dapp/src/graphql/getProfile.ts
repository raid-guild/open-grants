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
  query GetProfile($address: ID!, $first: Int!) {
    user(id: $address) {
      id
      name
      imageHash
      funded
      earned
      pledged
      withdrawn
      streamed
      grantsFunded(
        first: $first
        orderBy: timestamp
        where: { name_not: "" }
        orderDirection: desc
      ) {
        ...GrantDetails
      }
      grantsReceived(
        first: $first
        orderBy: timestamp
        where: { name_not: "" }
        orderDirection: desc
      ) {
        ...GrantDetails
      }
      streams(first: $first, orderBy: timestamp, orderDirection: desc) {
        ...StreamDetails
      }
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
      address: address.toLowerCase(),
      first,
    })
    .toPromise();

  if (!data) {
    if (error) {
      throw error;
    }

    return null;
  }
  if (data.user) {
    return parseProfile(data.user);
  }
  return undefined;
};

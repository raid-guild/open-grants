import gql from 'fake-tag';

import { GetGrantQuery, GetGrantQueryVariables } from './autogen/types';
import { client } from './client';
import { GrantFragment } from './fragments';

const grantQuery = gql`
    query GetGrant($address: ID!) {
        grant(id: $address) {
            ...GrantFragment
        }
    }
    ${GrantFragment}
`;

export const getGrant = async (address: string | undefined) => {
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
    return data.grant;
};

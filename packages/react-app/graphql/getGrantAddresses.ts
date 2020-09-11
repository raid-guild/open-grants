import gql from 'fake-tag';

import {
    GetGrantAddressesQuery,
    GetGrantAddressesQueryVariables,
} from './autogen/types';
import { client } from './client';
import { GrantFragment } from './fragments';

const grantsQuery = gql`
    query GetGrantAddresses($first: Int) {
        grants(first: $first) {
            id
        }
    }
    ${GrantFragment}
`;

export const getGrantAddresses = async (first = 50) => {
    const { data, error } = await client
        .query<GetGrantAddressesQuery, GetGrantAddressesQueryVariables>(
            grantsQuery,
            { first },
        )
        .toPromise();

    if (!data) {
        if (error) {
            throw error;
        }

        return [];
    }

    return data.grants;
};

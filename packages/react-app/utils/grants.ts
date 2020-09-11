import { utils } from 'ethers';
import { Grant } from 'graphql/autogen/types';

import { getMetadata, Metadata } from './ipfs';

export type ParsedGrant = Grant & Metadata;

export const parseGrant = async (
    grant: Grant | undefined | null,
): Promise<ParsedGrant | undefined> => {
    if (!grant) return undefined;
    const unnamedGrant = {
        ...grant,
        name: 'Unnamed Grant',
        description: '',
        link: '',
        additionalLink: '',
    };
    try {
        if (grant.uri && grant.uri !== '0x') {
            const uri = new Uint8Array(utils.arrayify(grant.uri));
            const metadata = await getMetadata(uri);
            return {
                ...unnamedGrant,
                ...metadata,
            };
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
    return unnamedGrant;
};

export const parseGrants = async (
    grants: Array<Grant | undefined | null>,
): Promise<Array<ParsedGrant | undefined>> => {
    return Promise.all(grants.map(grant => parseGrant(grant)));
};

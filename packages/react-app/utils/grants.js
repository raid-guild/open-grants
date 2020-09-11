import { getMetadata } from './ipfs';

import { utils } from 'ethers';

export const parseGrant = async grant => {
    const unnamedGrant = {
        ...grant,
        name: 'Unnamed Grant',
        description: '',
        link: '',
        additionalLink: '',
    };
    try {
        if (grant.uri && grant.uri !== '0x') {
            const gotUri = Uint8Array.from(utils.arrayify(grant.uri));
            const uri = [
                1,
                113,
                18,
                32,
                75,
                146,
                219,
                129,
                58,
                145,
                0,
                36,
                97,
                184,
                64,
                241,
                50,
                245,
                25,
                210,
                43,
                200,
                226,
                228,
                166,
                18,
                220,
                5,
                37,
                110,
                128,
                99,
                2,
                236,
                51,
                5,
            ];
            const newUri = Uint8Array.from(uri);
            console.log({ gotUri, newUri });
            const metadata = await getMetadata(newUri);
            return {
                ...unnamedGrant,
                metadata,
            };
        }
    } catch (error) {
        console.log(error);
    }
    return unnamedGrant;
};

export const parseGrants = async grants => {
    return Promise.all(grants.map(grant => parseGrant(grant)));
};

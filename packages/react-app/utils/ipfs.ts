import CID from 'cids';
import IPFSClient from 'ipfs-http-client';

const ipfs = new IPFSClient({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
});

export type Metadata = {
    name: string;
    description: string;
    link: string;
    additionalLink: string;
}

export const uploadMetadata = async (metadata: Metadata): Promise<Uint8Array> => {
    const node = await ipfs.dag.put(metadata);
    const cids = new CID(1, 'dag-cbor', node.multihash);
    return cids.bytes;
}

export const getMetadata = async (bytes: Uint8Array): Promise<Metadata> => {
    const cid = new CID(bytes);
    const data = await ipfs.dag.get(cid);
    return data.value;
}

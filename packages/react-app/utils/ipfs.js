import ipfsClient from 'ipfs-http-client';
import CID from 'cids';

const ipfs = new ipfsClient({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
});

export async function uploadMetadata(metadata) {
    const node = await ipfs.dag.put(metadata);
    const cids = new CID(1, 'dag-cbor', node.multihash);
    return cids.bytes;
}

export async function getMetadata(bytes) {
    const cid = new CID(bytes);
    const data = await ipfs.dag.get(cid);
    return data.value;
}

export async function uploadFile(file) {
    const node = await ipfs.add([file]);
    return node.path;
}

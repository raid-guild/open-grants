import Base58 from 'base-58';
import IPFSClient from 'ipfs-http-client';

const ipfsInfura = new IPFSClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
});

const ipfsTheGraph = new IPFSClient({
  protocol: 'https',
  host: 'api.thegraph.com',
  port: 443,
  'api-path': '/ipfs/api/v0/',
});

export type Grantee = {
  address: string;
  amount: string;
  description: string;
};

export type Metadata = {
  name: string;
  description: string;
  link: string;
  contactLink: string;
  grantees: Grantee[];
};

export const uploadMetadata = async (metadata: Metadata): Promise<string> => {
  if (!metadata.name) return '0x';
  const objectString = JSON.stringify(metadata);
  const bufferedString = Buffer.from(objectString);
  const [node] = await Promise.all([
    ipfsTheGraph.add(bufferedString),
    ipfsInfura.add(bufferedString), // automatically pinned
  ]);
  const { hash } = node[0];
  await ipfsTheGraph.pin.add(hash);
  const bytes = Buffer.from(Base58.decode(hash));
  const hexString = `0x${bytes.slice(2).toString('hex')}`;
  return hexString;
};

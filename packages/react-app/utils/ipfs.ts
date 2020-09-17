import Base58 from 'base-58';
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
  contactLink: string;
};

export const uploadMetadata = async (metadata: Metadata): Promise<string> => {
  const objectString = JSON.stringify(metadata);
  const bufferedString = Buffer.from(objectString);
  const node = await ipfs.add(bufferedString);
  return `0x${  Buffer.from(Base58.decode(node.path)).toString('hex')}`;
};

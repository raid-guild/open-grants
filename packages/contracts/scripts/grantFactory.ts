import { ethers } from '@nomiclabs/buidler';

async function main() {
  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  console.log('Deploying GrantFactory with the account:', address);

  if (deployer.provider) {
    console.log(
      'Account balance:',
      ethers.utils.formatEther(await deployer.provider.getBalance(address)),
      'ETH',
    );
  }

  // We get the contract to deploy
  const GrantFactory = await ethers.getContractFactory(
    'UnmanagedStreamFactory',
  );
  const grantFactory = await GrantFactory.deploy();

  await grantFactory.deployed();

  console.log('Grant Factory deployed to:', grantFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

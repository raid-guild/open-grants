import { ethers } from '@nomiclabs/buidler';

async function main() {
  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  console.log('Deploying VestingFactory with the account:', address);

  if (deployer.provider) {
    console.log(
      'Account balance:',
      ethers.utils.formatEther(await deployer.provider.getBalance(address)),
      'ETH',
    );
  }

  // We get the contract to deploy
  const VestingFactory = await ethers.getContractFactory('EtherVestingFactory');
  const vestingFactory = await VestingFactory.deploy();

  await vestingFactory.deployed();

  console.log('Vesting Factory deployed to:', vestingFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

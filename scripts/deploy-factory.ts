import bre from '@nomiclabs/buidler';

async function main() {

    const [deployer] = await bre.ethers.getSigners();
    const address =  await deployer.getAddress();
    console.log(
        "Deploying contracts with the account:",
        address
    );

    if (deployer.provider) {
      console.log("Account balance:", (await deployer.provider.getBalance(address)));
    }

    // We get the contract to deploy
    const GrantFactory = await bre.ethers.getContractFactory("GrantFactory");
    const grantFactory = await GrantFactory.deploy();
  
    await grantFactory.deployed();
  
    console.log("Grant Factory deployed to:", grantFactory.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
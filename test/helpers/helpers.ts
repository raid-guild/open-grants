import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';

const AMOUNTS = [1000];
const TARGET_FUNDING = AMOUNTS.reduce((a, b) => a + b, 0);

const AMOUNTS_1 = [1400, 1000];
const TARGET_FUNDING_1 = AMOUNTS_1.reduce((a, b) => a + b, 0);

async function fixture(bre: BuidlerRuntimeEnvironment) {
  const provider = bre.waffle.provider;
  const ethers = bre.ethers;
  const { AddressZero, Zero } = ethers.constants;
  let wallets = await bre.ethers.signers();
  let addresses = await wallets.map(async (x, i) => {
    return {
      signer: x,
      i,
      address: await x.getAddress()
    }
  });
  let sortedAddresses = (await Promise.all(addresses)).sort((x, y) => x.address > y.address ? 1 : -1)
  wallets = sortedAddresses.map(x => x.signer);
  const [granteeWallet, donorWallet, managerWallet, secondDonorWallet, unknownWallet] = wallets;


  // Factories
  const ManagedCappedGrant = await ethers.getContractFactory("ManagedCappedGrant");
  const GrantToken = await ethers.getContractFactory("GrantToken");
  const GrantFactory = await ethers.getContractFactory("GrantFactory");
  
  const currentTime = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
  
  // Deploy
  const token = await GrantToken.deploy(...["Grant Token", "GT"]);
  const managedCappedGrantWithToken = await ManagedCappedGrant.deploy(
      [await granteeWallet.getAddress()], // Grantees 
      AMOUNTS,                 // Allocations
      await managerWallet.getAddress(),   // Manager address
      token.address,           // Currency
      TARGET_FUNDING,          // Target Funding
      currentTime + 86400,     // Funding deadline
      currentTime + 86400 * 2  // Contract Expiration
  );

  const managedCappedGrantWithEther = await ManagedCappedGrant.deploy(
      [await granteeWallet.getAddress()], // Grantees 
      AMOUNTS,                      // Allocations
      await managerWallet.getAddress(),   // Manager address
      AddressZero,                  // Currency
      TARGET_FUNDING,               // Target Funding
      currentTime + 86400,          // Funding deadline
      currentTime + 86400 * 2       // Contract Expiration
  );

  const grantFactory = await GrantFactory.deploy();

  await token.deployed();
  await managedCappedGrantWithEther.deployed();
  await managedCappedGrantWithToken.deployed();
  await grantFactory.deployed();



  // Initial token balance.
  await token.mint(await donorWallet.getAddress(), 1e6);

  const tokenFromManager = token.connect(managerWallet);
  const tokenFromGrantee = token.connect(granteeWallet);
  const tokenFromDonor = token.connect(donorWallet);

  const grantFromDonorWithToken = managedCappedGrantWithToken.connect(donorWallet);
  const grantFromDonorWithEther = managedCappedGrantWithEther.connect(donorWallet);
  const grantFromManagerWithToken = managedCappedGrantWithToken.connect(managerWallet);
  const grantFromManagerWithEther = managedCappedGrantWithEther.connect(managerWallet);
  const grantFromGranteeWithToken = managedCappedGrantWithToken.connect(granteeWallet);
  const grantFromGranteeWithEther = managedCappedGrantWithEther.connect(granteeWallet);

  return {
    grantFactory,
    grantFromGranteeWithToken,
    grantFromGranteeWithEther,
    grantFromDonorWithToken,
    grantFromDonorWithEther,
    grantFromManagerWithToken,
    grantFromManagerWithEther,
    tokenFromDonor,
    tokenFromGrantee,
    tokenFromManager,
    granteeWallet,
    donorWallet,
    managerWallet,
    secondDonorWallet,
    unknownWallet,
    fundingDeadline: currentTime + 86400,
    contractExpiration: currentTime + 86400 * 2,
    provider,
    TARGET_FUNDING
  };
}

async function fixtureWithMultipleGrantee(bre: BuidlerRuntimeEnvironment) {
    const provider = bre.waffle.provider;
    const ethers = bre.ethers;
    const { AddressZero, Zero } = ethers.constants;
    let wallets = await bre.ethers.signers();
    // resolve promises then sort
    let addresses = await wallets.map(async (x, i) => {
      return {
        signer: x,
        i,
        address: await x.getAddress()
      }
    });
    let sortedAddresses = (await Promise.all(addresses)).sort((x, y) => x.address > y.address ? 1 : -1)
    wallets = sortedAddresses.map(x => x.signer);
    const [
      granteeWallet,
      secondGranteeWallet,
      donorWallet,
      secondDonorWallet,
      managerWallet,
      thirdPersonWallet
    ] = wallets;


    // Factories
    const ManagedCappedGrant = await ethers.getContractFactory("ManagedCappedGrant");
    const GrantToken = await ethers.getContractFactory("GrantToken");
    const GrantFactory = await ethers.getContractFactory("GrantFactory");
    
    const currentTime = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
    
    // Deploy
    const token = await GrantToken.deploy(...["Grant Token", "GT"]);
    const managedCappedGrantWithToken = await ManagedCappedGrant.deploy(
        [await granteeWallet.getAddress(), await secondGranteeWallet.getAddress()], // Grantees 
        AMOUNTS_1,                 // Allocations
        await managerWallet.getAddress(),   // Manager address
        token.address,           // Currency
        TARGET_FUNDING_1,          // Target Funding
        currentTime + 86400,     // Funding deadline
        currentTime + 86400 * 2  // Contract Expiration
    );

    const managedCappedGrantWithEther = await ManagedCappedGrant.deploy(
        [await granteeWallet.getAddress(), await secondGranteeWallet.getAddress()], // Grantees 
        AMOUNTS_1,                      // Allocations
        await managerWallet.getAddress(),   // Manager address
        AddressZero,                  // Currency
        TARGET_FUNDING_1,               // Target Funding
        currentTime + 86400,          // Funding deadline
        currentTime + 86400 * 2       // Contract Expiration
    );


    await token.deployed();
    await managedCappedGrantWithEther.deployed();
    await managedCappedGrantWithToken.deployed();

    // Initial token balance.
    await token.mint(await donorWallet.getAddress(), 1e6);
    await token.mint(await secondDonorWallet.getAddress(), 1e6);


    const tokenFromManager = token.connect(managerWallet);
    const tokenFromGrantee = token.connect(granteeWallet);
    const tokenFromDonor = token.connect(donorWallet);
    const tokenFromSecondDonor = token.connect(secondDonorWallet);
  
    const grantFromDonorWithToken = managedCappedGrantWithToken.connect(donorWallet);
    const grantFromSecondDonorWithToken = managedCappedGrantWithToken.connect(secondDonorWallet);
    const grantFromDonorWithEther = managedCappedGrantWithEther.connect(donorWallet);
    const grantFromSecondDonorWithEther = managedCappedGrantWithEther.connect(secondDonorWallet);
    const grantFromManagerWithToken = managedCappedGrantWithToken.connect(managerWallet);
    const grantFromManagerWithEther = managedCappedGrantWithEther.connect(managerWallet);
    const grantFromGranteeWithToken = managedCappedGrantWithToken.connect(granteeWallet);
    const grantFromGranteeWithEther = managedCappedGrantWithEther.connect(granteeWallet);

    return {
      grantFromGranteeWithToken,
      grantFromDonorWithToken,
      grantFromSecondDonorWithToken,
      grantFromManagerWithToken,
      tokenFromDonor,
      tokenFromSecondDonor,
      granteeWallet,
      secondGranteeWallet,
      donorWallet,
      secondDonorWallet,
      managerWallet,
      thirdPersonWallet,
      grantFromDonorWithEther,
      grantFromSecondDonorWithEther,
      grantFromManagerWithEther,
      provider,
      TARGET_FUNDING
    };
}


export const helpers = {
    constants: {
        AMOUNTS,
        TARGET_FUNDING,
        AMOUNTS_1,
        TARGET_FUNDING_1
    },
    fixtures: {
        fixture,
        fixtureWithMultipleGrantee
    }
}
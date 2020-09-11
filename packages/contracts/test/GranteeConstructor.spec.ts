import chai from 'chai';
import * as waffle from 'ethereum-waffle';
import { Contract, Signer } from 'ethers';

import bre from '@nomiclabs/buidler';
import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
import { AddressZero } from 'ethers/constants';

chai.use(waffle.solidity);
const { expect } = chai;

import { granteeConstructorTests } from './shared/GranteeConstructor';

// Constants.
const URI = '/orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVSU/';
const AMOUNTS = [150, 456, 111, 23];
const CONTRACT_NAME = 'GranteeConstructor';

async function fixture(bre: BuidlerRuntimeEnvironment, contractName: string) {
  const provider = bre.waffle.provider;
  const ethers = bre.ethers;

  // Capture and sort wallets.
  let wallets = await bre.ethers.signers();
  let addresses = await wallets.map(async (x, i) => {
    return {
      signer: x,
      i,
      address: await x.getAddress(),
    };
  });
  let sortedAddresses = (await Promise.all(addresses)).sort((x, y) =>
    x.address > y.address ? 1 : -1,
  );
  wallets = sortedAddresses.map(x => x.signer);
  const [
    donorWallet0,
    donorWallet1,
    granteeWallet0,
    granteeWallet1,
    granteeWallet2,
    granteeWallet3,
  ] = wallets;

  // Prepare contract.
  const ContractFactory = await ethers.getContractFactory(contractName);
  const constructorGrantees = [
    await granteeWallet0.getAddress(),
    await granteeWallet1.getAddress(),
    await granteeWallet2.getAddress(),
    await granteeWallet3.getAddress(),
  ];

  // Deploy.
  const contract = await ContractFactory.deploy(
    constructorGrantees, // Grantees
    AMOUNTS, // Allocations
    true,
  );

  // Await Deploy.
  await contract.deployed();

  return {
    donors: [donorWallet0, donorWallet1],
    grantees: [granteeWallet0, granteeWallet1, granteeWallet2, granteeWallet3],
    provider,
    contract,
  };
}

describe('Grantee-Constructor', () => {
  const ethers = bre.ethers;

  let _grantees: Signer[];
  let _donors: Signer[];
  let _provider: any;
  let _contract: Contract;

  before(async () => {
    const { donors, grantees, provider, contract } = await fixture(
      bre,
      CONTRACT_NAME,
    );

    _grantees = grantees;
    _donors = donors;
    _provider = provider;
    _contract = contract;
  });

  granteeConstructorTests(
    fixture, // Fixture for our grant.
    AMOUNTS, // Grantee amount from global above.
    true, // This fixture (unmanagedStream) uses percentage based grants.
    CONTRACT_NAME,
  );

  it('should fail when no grantees passed', async () => {
    const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
    await expect(ContractFactory.deploy([], AMOUNTS, true)).to.be.revertedWith(
      'constructor::Invalid Argument. Must have one or more grantees.',
    );
  });

  it('should fail grantees array is not the same length as the AMOUNTs array', async () => {
    const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
    await expect(
      ContractFactory.deploy([AddressZero], AMOUNTS, true),
    ).to.be.revertedWith(
      'constructor::Invalid Argument. _grantees.length must equal _amounts.length',
    );
  });

  it('should fail if an amount is 0', async () => {
    const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
    await expect(
      ContractFactory.deploy([AddressZero], [0], true),
    ).to.be.revertedWith(
      'constructor::Invalid Argument. currentAmount must be greater than 0.',
    );
  });

  it('should fail if grantee array is out of order', async () => {
    const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
    await expect(
      ContractFactory.deploy(
        [AddressZero, '0x0000000000000000000000000000000000000001'],
        [0, 1],
        true,
      ),
    ).to.be.revertedWith(
      'constructor::Invalid Argument. currentAmount must be greater than 0.',
    );
  });

  it('should fail if amount causes an overflow', async () => {
    const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
    await expect(
      ContractFactory.deploy(
        [
          '0x0000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000002',
        ],
        [ethers.constants.MaxUint256, 1],
        true,
      ),
    ).to.be.revertedWith('revert SafeMath: addition overflow');
  });

  it('should fail if grantee is address 0 is out of order', async () => {
    const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
    await expect(
      ContractFactory.deploy(
        ['0x0000000000000000000000000000000000000001', AddressZero],
        [0, 1],
        true,
      ),
    ).to.be.revertedWith(
      'constructor::Invalid Argument. currentAmount must be greater than 0.',
    );
  });
});

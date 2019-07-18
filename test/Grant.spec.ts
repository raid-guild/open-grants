import Grant from "../build/Grant.json";
import chai from 'chai';
import * as waffle from "ethereum-waffle";
import { Contract, Wallet, constants } from "ethers";
import { Web3Provider } from "ethers/providers";
import { bigNumberify, solidityKeccak256 } from "ethers/utils";


chai.use(waffle.solidity);
const {expect} = chai;

describe("Grant", () => {

  let provider: Web3Provider;
  let wallet: Wallet;
  let grant: Contract;


  before(async () => {
    provider = waffle.createMockProvider();
    wallet = (await waffle.getWallets(provider))[0];
    grant = await waffle.deployContract(wallet, Grant);
  });

  describe("Create Grant", () => {
    let id: string;
    let receipt: any;
    let res: any;

    before(async () => {
      res = await grant.create(
        [{ grantee: wallet.address, allocation: 1000, received: 0 }],
        [{ grantManager: wallet.address, weight: 1 }],
        constants.AddressZero,
        1000,
        0,
        1,
        [0x0]
      );
  
      receipt = await res.wait();
      const previousBlockHash = (await provider.getBlock(receipt.blockNumber - 1)).hash;
      id = solidityKeccak256(
        ["address", "bytes32"],
        [wallet.address, previousBlockHash]
      );
    });

    it("should emit LogStatusChange event", async () => {
      const emittedEvent = receipt.events[0];
      expect(emittedEvent.event).to.eq("LogStatusChange");
      expect(emittedEvent.eventSignature).to.eq("LogStatusChange(bytes32,uint8)");
      expect(emittedEvent.args).to.include({ id: id, grantStatus: 1 });
    });
  
    it("should persist the grant's details", async () => {
      const {
        currency,
        targetFunding,
        totalFunded,
        totalPayed,
        expiration,
        grantType,
        grantStatus,
        extraData
      } = await grant.getGrant(id);

      expect(currency).to.eq(constants.AddressZero);
      expect(targetFunding).to.eq(1000);
      expect(totalFunded).to.eq(0);
      expect(totalPayed).to.eq(0);
      expect(expiration).to.eq(0);
      expect(grantType).to.eq(1);
      expect(grantStatus).to.eq(1);
      expect(extraData).to.eq("0x00");

    });

  });

});

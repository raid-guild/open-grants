import Grant from "../build/Grant.json";
import GrantToken from "../build/GrantToken.json";
import chai from 'chai';
import * as waffle from "ethereum-waffle";
import { Contract, Wallet, constants } from "ethers";
import { BigNumber } from "ethers/utils/bignumber";
import { Web3Provider, Provider } from "ethers/providers";
import { bigNumberify, solidityKeccak256, id } from "ethers/utils";
import { AddressZero } from "ethers/constants";


chai.use(waffle.solidity);
const {expect} = chai;

describe("Grant", () => {

  const GrantStatus = {
    INIT:     0,
    SUCCESS:  1,
    DONE:     2
  }


  async function fixture(provider: any, wallets: Wallet[]) {

    const currentTime = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
    const [granteeWallet, donorWallet, managerWallet] = wallets;
    const token: Contract = await waffle.deployContract(donorWallet, GrantToken, ["Grant Token", "GT", 18]);
    const grantWithToken: Contract = await waffle.deployContract(
      granteeWallet,
      Grant,
      [[granteeWallet.address], [1000], managerWallet.address, token.address, 10000, currentTime + 86400, currentTime + (86400 * 2)],
      { gasLimit: 6e6 }
    );
    const grantWithEther: Contract = await waffle.deployContract(
      granteeWallet,
      Grant,
      [[granteeWallet.address], [1000], managerWallet.address, AddressZero, 10000, currentTime + 86400, currentTime + (86400 * 2)],
      { gasLimit: 6e6 }
    );

    // Initial token balance.
    await token.mint(donorWallet.address, 1e6);

    const grantFromDonor: Contract = new Contract(grantWithToken.address, Grant.abi, donorWallet);
    const grantFromDonorWithEther: Contract = new Contract(grantWithEther.address, Grant.abi, donorWallet);
    const grantFromManager: Contract = new Contract(grantWithToken.address, Grant.abi, managerWallet);

    return {
      grantWithToken,
      grantWithEther,
      grantFromDonor,
      grantFromDonorWithEther,
      grantFromManager,
      grantFromGrantee: grantWithToken,
      token,
      granteeWallet,
      donorWallet,
      managerWallet,
      fundingExpiration: currentTime + 86400,
      contractExpiration: currentTime + (86400 * 2),
      provider
    };
  }


  describe("Create Grant", () => {
    let _granteeAddress: string;
    let _managerAddress: string;
    let _fundingExpiration: BigNumber;
    let _contractExpiration: BigNumber;
    let _grant: Contract;
    let _token: Contract;

    describe("When created", () => {
      before(async () => {
        const {
          grantWithToken,
          token,
          granteeWallet,
          managerWallet,
          fundingExpiration,
          contractExpiration
        } = await waffle.loadFixture(fixture);
        _granteeAddress = granteeWallet.address;
        _managerAddress = managerWallet.address;
        _fundingExpiration = fundingExpiration;
        _contractExpiration = contractExpiration;
        _grant = grantWithToken;
        _token = token;
      });
      
      it("should fail if fundingExpiration greater than contractExpiration.");
      it("should fail if fundingExpiration less than now.");
      it("should fail if contractExpiration less than now.");

      it("should persist the correct overall funding target", async () => {
        const targetFunding = await _grant.targetFunding();
        expect(targetFunding).to.eq(10000);
      });

      it("should persist the correct grantee funding target", async () => {
        const grantee = await _grant.getGrantee(_granteeAddress);        
        expect(grantee.targetFunding).to.eq(1000);
      });

      it("should persist the correct manager", async () => {
        const manager = await _grant.manager();
        expect(manager).to.eq(_managerAddress);
      });

      it("should persist the correct currency", async () => {
        const currency = await _grant.currency();
        expect(currency).to.eq(_token.address);
      });

      it("should persist the correct fundingExpiration", async () => {
        const fundingExpiration = await _grant.fundingExpiration();
        expect(fundingExpiration).to.eq(_fundingExpiration);
      });

      it("should persist the correct contractExpiration", async () => {
        const contractExpiration = await _grant.contractExpiration();
        expect(contractExpiration).to.eq(_contractExpiration);
      });

      it("should persist the correct grantStatus", async () => {
        const grantStatus = await _grant.grantStatus();
        expect(grantStatus).to.eq(GrantStatus.INIT);
      });
    });

  });

  describe("Signaling", () => {

    describe("When Ether", () => {
      let _grantFromDonor: Contract;
      let _donorAddress: string;
      let _provider: any;
      

      before(async () => {
        const {
          grantFromDonorWithEther,
          donorWallet,
          provider
        } = await waffle.loadFixture(fixture);
        _donorAddress = donorWallet.address;
        _grantFromDonor = grantFromDonorWithEther;
        _provider = provider;
      });


      it("should fail if ether sent does not match value arg.", async () => {
        await expect(
          _grantFromDonor.signal(1e6)
        ).to.be.revertedWith("signal::Invalid Argument. value must match msg.value.");
      });

      it("should emit LogSignal event", async () => {
        await expect(_grantFromDonor.signal(1e6, { value: 1e6 }))
          .to.emit(_grantFromDonor, "LogSignal")
          .withArgs(_donorAddress, constants.AddressZero, 1e6);
      });

      it("sender should have their funds returned", async () => {
        const startingBalance = await _provider.getBalance(_donorAddress);
        // Set gas price to 1 to make it simple to calc gas spent in eth. 
        const receipt = await (await _grantFromDonor.signal(1e6, { value: 1e6, gasPrice: 1 })).wait();
        const endingBalance = await _provider.getBalance(_donorAddress);

        expect(endingBalance).to.eq(startingBalance.sub(receipt.gasUsed));
      });

      describe("After funding success", () => {

        before(async () => {
          await _grantFromDonor.fund(10000, { value: 10000 });
        });

        it("should revert", async () => {
          await expect(_grantFromDonor.signal(1e6, { value: 1e6 }))
            .to.be.revertedWith("signal::Status Error. Must be GrantStatus.INIT to signal.");
        });

      });
    });

    describe("When Token", () => {
      let _grantFromDonor: Contract;
      let _token: Contract;
      let _donorAddress: string;

      before(async () => {
        const {
          grantFromDonor,
          token,
          donorWallet
        } = await waffle.loadFixture(fixture);
        _donorAddress = donorWallet.address;
        _grantFromDonor = grantFromDonor;
        _token = token;
      });

      
      it("should fail if tokens no approved.", async () => {
        await expect(_grantFromDonor.signal(1e6))
          .to.be.revertedWith("SafeMath: subtraction overflow");
      });
        
      describe("When approved", async () => {
        
        beforeEach(async () => {
          await _token.approve(_grantFromDonor.address, 1e6);
        });
          
        it("should reject ether signalling for token funded grants.", async () => {
          await expect(_grantFromDonor.signal(1e6, { value: 1e6 }))
            .to.be.revertedWith("signal::Currency Error. Cannot send Ether to a token funded grant.");
        });

        it("should emit LogSignal event", async () => {
          await expect(_grantFromDonor.signal(1e6))
            .to.emit(_grantFromDonor, "LogSignal")
            .withArgs(_donorAddress, _token.address, 1e6);
        });

        it("sender should have their funds returned", async () => {
          await _grantFromDonor.signal(1e6);
          const endingBalance = await _token.balanceOf(_donorAddress);

          expect(endingBalance).to.eq(1e6);
        });
      });

    });

  });

  describe("Fund Grant", () => {

    let _donorWallet: Wallet;
    let _managerWallet: Wallet;
    let _grantFromGrantee: Contract;
    let _grantFromDonor: Contract;
    let _token: Contract;
    let _provider: any;
    let _res: any;

    describe("With Ether", () => {

      before(async () => {
        const {
          donorWallet,
          managerWallet,
          grantFromDonorWithEther,
          provider
        } = await waffle.loadFixture(fixture);

        _donorWallet = donorWallet;
        _managerWallet = managerWallet;
        _grantFromDonor = grantFromDonorWithEther;
        _provider = provider;
      });

      it("should permit sending to the fallback function", async () => {
        await _donorWallet.sendTransaction(
          { to: _grantFromDonor.address, value: 5000 }
        );
      });

      describe("When funding tx complete", () => {

        before(async () => {
          const balance = await _provider.getBalance(_grantFromDonor.address);
          expect(balance).to.eq(5000);
          _res = await (await _grantFromDonor.fund(10000, { value: 10000 })).wait();
        });

        it("should emit LogFunding event", async () => {
          const emittedEvent = _res.events[0];
          expect(emittedEvent.event).to.eq("LogFunding");
          expect(emittedEvent.eventSignature).to.eq("LogFunding(address,uint256)");

          const { donor, value } = emittedEvent.args;
          expect(donor).to.eq(_donorWallet.address);
          expect(value).to.eq(bigNumberify(5000));
        });

        it("should emit LogStatusChange event", async () => {
          const emittedEvent = _res.events[1];
          expect(emittedEvent.event).to.eq("LogStatusChange");
          expect(emittedEvent.eventSignature).to.eq("LogStatusChange(uint8)");
          expect(emittedEvent.args).to.include({ grantStatus: GrantStatus.SUCCESS });
        });

        describe("Grant data", () => {

          it("should update donor mapping", async () => {

            const donorStruct = await _grantFromDonor.getDonor(_donorWallet.address);
            const { refundApproved, funded, refunded } = donorStruct;

            expect(funded).to.eq(10000);
            expect(refunded).to.eq(0);
            expect(refundApproved).to.eq(0);
          });

          it("should update totalFunded", async () => {
            const totalFunded = await _grantFromDonor.totalFunding();
            expect(totalFunded).to.eq(10000);
          });

          it("should update grantStatus", async () => {
            const grantStatus = await _grantFromDonor.grantStatus();
            expect(grantStatus).to.eq(GrantStatus.SUCCESS);
          });
          
        });

        it("should revert if sender has received a refund.");
        it("should revert if funding expiration passed.");

        it("should update the contract balance, with change returned to donor if over funded", async () => {
          const balance = await _provider.getBalance(_grantFromDonor.address);
          expect(balance).to.eq(10000);
        });
      });
    });

    describe("With Token", () => {

      before(async () => {
        const {
          donorWallet,
          managerWallet,
          grantFromDonor,
          grantFromGrantee,
          token
        } = await waffle.loadFixture(fixture);

        _donorWallet = donorWallet;
        _managerWallet = managerWallet;
        _grantFromDonor = grantFromDonor;
        _grantFromGrantee = grantFromGrantee;
        _token = token;
      });

      it("should reject ether funding for token funded grants.", async () => {
        await expect(_grantFromDonor.fund(1000, { value: 1000 }))
          .to.be.revertedWith("fundWithToken::Currency Error. Cannot send Ether to a token funded grant.");
      });

      describe("When funding tx complete", () => {
        before(async () => {
          await _token.approve(_grantFromGrantee.address, 1e5);

          _res = await (await _grantFromDonor.fund(10000)).wait();
        });

        it("should emit LogFunding event", async () => {
          const emittedEvent = _res.events[2];
          expect(emittedEvent.event).to.eq("LogFunding");
          expect(emittedEvent.eventSignature).to.eq("LogFunding(address,uint256)");

          const { donor, value } = emittedEvent.args;
          expect(donor).to.eq(_donorWallet.address);
          expect(value).to.eq(bigNumberify(10000));
        });

        it("should emit LogStatusChange event", async () => {
          const emittedEvent = _res.events[3];
          expect(emittedEvent.event).to.eq("LogStatusChange");
          expect(emittedEvent.eventSignature).to.eq("LogStatusChange(uint8)");
          expect(emittedEvent.args).to.include({ grantStatus: GrantStatus.SUCCESS });
        });

        describe("Grant data", () => {

          it("should update donor mapping", async () => {
            const donorStruct = await _grantFromGrantee.getDonor(_donorWallet.address);
            const { refundApproved, funded, refunded } = donorStruct;
            
            expect(funded).to.eq(10000);
            expect(refunded).to.eq(0);
            expect(refundApproved).to.eq(0);
          });

          it("should update totalFunded", async () => {
            const totalFunded = await _grantFromGrantee.totalFunding();
            expect(totalFunded).to.eq(10000);
          });
          
          it("should update grantStatus", async () => {
            const grantStatus = await _grantFromGrantee.grantStatus();
            expect(grantStatus).to.eq(GrantStatus.SUCCESS);
          });
        });

        it("should update the contract balance", async () => {
          const balance = await _token.balanceOf(_grantFromGrantee.address);
          expect(balance).to.eq(10000)
        });

      });

      it("should fail if expired");
      it("should fail if grantStatus is SUCCESS or DONE");
    });
  });

  describe("Cancel Grant", () => {
    it("should fail if wrong status");
    it("should permit GrantManager to cancel");
    it("should fail if not GrantManager");
    it("should emit LogStatusChange event DONE");
  });

  describe("Payouts", () => {
    it("should revert if GrantStatus not SUCCESS");
    it("should revert if called by non manager and not a Grantee matching grantee arg.");
    describe("approvePayout", () => {
      it("should revert if approved for more than remaining allocation.");
      it("should log payment approval event.");
      it("should update amount approved.");
    });

    describe("withdrawPayout", () => {
      it("should revert if sender does not match grantee.");
      it("should revert if value does not match payoutApproved.");
      it("should update total payed.");
      it("should update payoutApproved.");
      it("should update contract balance.");
      it("should send payment.");
      it("should emit payment event.");

    });
  });

  describe("Refunds", () => {
    it("should revert if called by non manager and not a Donor matching donor arg.");
    describe("approveRefund", () => {
      it("should revert if donor already refunded.");
      it("should should update refundApproved.");
    });
    describe("withdrawRefund", () => {
      describe("when manager initiated", () => {

      });
      describe("when donor initiated", () => {
        
      });
    });
  });

});

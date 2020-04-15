import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import { ethers } from 'ethers';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AddressZero, Zero } from "ethers/constants";
import { UtilsService } from './utils.service';
import { AppSettings } from '../config/app.config';
import { async } from 'rxjs/internal/scheduler/async';

declare let require: any;
declare let window: any;

let tokenAbi = require('../../../abi.json');

export interface AcctInfo {
    account: String,
    balance: number
};

@Injectable({
    providedIn: 'root'
})

export class EthcontractService {
    private web3Provider: any;
    account: any;

    private acctInfoSubject = new Subject<AcctInfo>();
    acctInfo = this.acctInfoSubject.asObservable();

    constructor(
        private toastr: ToastrService,
        private utils: UtilsService
    ) {
        if (typeof window.web3 !== 'undefined') {
            this.web3Provider = window.web3.currentProvider;
        } else {
            this.toastr.warning('Please use a dapp browser like MetaMask plugin for chrome');
            // this.web3Provider = new Web3.providers.HttpProvider(AppSettings.ethersConfig.rpcURL);
            // this.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
        }

        // window.addEventListener('load', async () => {
        //     // Modern dapp browsers...
        //     if (window.ethereum) {
        //         window.web3 = new Web3(ethereum);
        //         try {
        //             // Request account access if needed
        //             await ethereum.enable();
        //             // Acccounts now exposed
        //             web3.eth.sendTransaction({/* ... */ });
        //         } catch (error) {
        //             // User denied account access...
        //         }
        //     }
        //     // Legacy dapp browsers...
        //     else if (window.web3) {
        //         window.web3 = new Web3(web3.currentProvider);
        //         // Acccounts always exposed
        //         web3.eth.sendTransaction({/* ... */ });
        //     }
        //     // Non-dapp browsers...
        //     else {
        //         console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        //     }
        // });

        window.web3 = new Web3(this.web3Provider);

        window.ethereum.on('accountsChanged', (accounts) => {
            console.log("accountsChanged");
            // this.getAccountInfo();
        });

        (async () => {
            window.ethereum.enable().then((res) => {
                console.log("res", res);
            }, (err) => {
                console.log("err", err);
            });
        })();
    }

    getAccountInfo(account) {
        return new Promise((resolve) => {

            window.web3.eth.getBalance(account, (err, balance) => {
                if (err === null) {
                    resolve({
                        account: account,
                        balance: (window.web3.fromWei(balance, "ether")).toNumber()
                    });
                } else {
                    resolve({
                        account: 'error',
                        balance: 0
                    });
                }
            });

            // window.web3.eth.getCoinbase((err, account) => {
            //     // console.log("account", account);
            //     this.account = account;
            //     if (err === null) {
            //         window.web3.eth.getBalance(account, (err, balance) => {
            //             if (err === null) {
            //                 this.acctInfoSubject.next({
            //                     account: account,
            //                     balance: (window.web3.fromWei(balance, "ether")).toNumber()
            //                 });
            //                 resolve();
            //             } else {
            //                 this.acctInfoSubject.next({
            //                     account: 'error',
            //                     balance: 0
            //                 })
            //                 resolve();
            //             }
            //         });
            //     }
            //     resolve();
            // });

            // window.web3.listAccounts().then(account => {
            //     // console.log("account", account)
            //     if (account.length) {
            //         window.web3.getBalance(account[0]).then((balance) => {
            //             this.acctInfoSubject.next({
            //                 account: account,
            //                 balance: (window.web3.fromWei(balance, "ether")).toNumber()
            //             });
            //         });
            //     } else {
            //         this.acctInfoSubject.next({
            //             account: 'error',
            //             balance: 0
            //         })
            //     }
            // }).catch(err => {
            //     this.acctInfoSubject.next({
            //         account: 'error',
            //         balance: 0
            //     })
            // });
        })
    }

    async deployContract(data) {
        return new Promise(async (resolve, reject) => {
            this.utils.startLoader();

            // let data = {
            //     currency: "wei",
            //     grantees: ['0x6D48912C6c768e0CAd669b0154DD85F156284A21'],
            //     amounts: [10000],
            //     manager: "0x14791697260E4c9A71f18484C9f997B308e59325",
            //     targetFunding: 10000,
            //     fundingExpiration: "1587114701",
            //     contractExpiration: "1589706701"
            // }
            // let provider = new ethers.providers.InfuraProvider(AppSettings.ethersConfig.networks, '56a56ec009b34e31b6aeb4eb817f0772');
            // let provider = ethers.getDefaultProvider(AppSettings.ethersConfig.networks);
            // let wallet = new ethers.Wallet(AppSettings.ethersConfig.privateKey, provider);

            let currency = AddressZero;
            if (data.currency == "wei") {
                currency = AddressZero;
            }

            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let factory = new ethers.ContractFactory(tokenAbi.abi, tokenAbi.bytecode, signer);

            factory.deploy(data.grantees, data.amounts, data.manager, currency, data.targetFunding,
                data.fundingExpiration, data.contractExpiration, { gasLimit: AppSettings.ethersConfig.gasLimit }).then((response) => {
                    console.log("response", response);
                    this.utils.stopLoader();
                    resolve({
                        status: "success",
                        message: "Reqest sent successfully",
                        address: response.address,
                        hash: response.deployTransaction.hash
                    });
                }, (error) => {
                    console.log(error)
                    this.utils.stopLoader();
                    resolve({
                        hash: '',
                        address: '',
                        status: "failed",
                        message: error.message
                    });
                });
            // let deployed_contract = await response.deployed();
        })
    }

    checkAvailableBalance(contractAddress) {
        return new Promise(async (resolve) => {
            try {
                let provider = ethers.getDefaultProvider(AppSettings.ethersConfig.networks);
                let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
                let response = await contract.availableBalance();
                resolve(response.toNumber());
            } catch (e) {
                resolve(0);
            }
        })
    }

    async isManager(contractAddress, publicKey) {
        return new Promise(async (resolve, reject) => {
            try {
                let provider = ethers.getDefaultProvider(AppSettings.ethersConfig.networks);
                let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
                let response = await contract.isManager(publicKey);
                resolve(response);
            } catch (e) {
                reject(false)
            }
        });
    }

    canFund(contractAddress) {
        return new Promise(async (resolve, reject) => {
            try {
                let provider = ethers.getDefaultProvider(AppSettings.ethersConfig.networks);
                let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
                let response = await contract.canFund();
                // console.log("response", response);
                resolve(response);
            } catch (e) {
                reject(false);
            }
        })
    }

    fund(contractAddress, amount) {
        return new Promise(async (resolve, reject) => {
            this.utils.startLoader();

            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let valuetkn = new ethers.utils.BigNumber(amount);

            signer.sendTransaction({
                to: contractAddress,
                value: valuetkn,
                gasLimit: AppSettings.ethersConfig.gasLimit
            })
                .then((response) => {
                    console.log("response", response);
                    this.utils.stopLoader();
                    resolve({
                        status: "success",
                        message: "Reqest sent successfully",
                        hash: response.hash
                    });
                }, (error) => {
                    console.log(error)
                    this.utils.stopLoader();
                    resolve({
                        hash: '',
                        status: "failed",
                        message: error.message
                    });
                });
        });
    }

    remainingAllocation(contractAddress, userPublicKey) {
        return new Promise(async (resolve, reject) => {
            try {
                let provider = ethers.getDefaultProvider(AppSettings.ethersConfig.networks);
                let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
                let response = await contract.remainingAllocation(userPublicKey);
                resolve(response.toNumber());
            } catch (e) {
                reject(0);
            }
        });
    }

    approvePayout(contractAddress, granteePublicKey, amount) {
        return new Promise(async (resolve, reject) => {
            this.utils.startLoader();
            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
            let contractWithSigner = contract.connect(signer);
            let valuetkn = new ethers.utils.BigNumber(amount);
            contractWithSigner.approvePayout(valuetkn, granteePublicKey, { gasLimit: AppSettings.ethersConfig.gasLimit }).then((response) => {
                console.log("response", response);
                this.utils.stopLoader();
                resolve({
                    status: "success",
                    message: "Reqest sent successfully",
                    contract: contractAddress,
                    grantee: granteePublicKey,
                    amount: amount,
                    hash: response.hash
                });
            }, (error) => {
                console.log(error)
                this.utils.stopLoader();
                resolve({
                    hash: '',
                    status: "failed",
                    message: error.message,
                    contract: contractAddress,
                    grantee: granteePublicKey,
                    amount: amount,
                });
            });
        });
    }

    approveRefund(contractAddress, userPublicKey, amount) {
        return new Promise(async (resolve, reject) => {
            // try {
            this.utils.startLoader();
            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
            let contractWithSigner = contract.connect(signer);
            let valuetkn = new ethers.utils.BigNumber(amount);
            let response = await contractWithSigner.approveRefund(valuetkn, userPublicKey, { gasLimit: AppSettings.ethersConfig.gasLimit });
            console.log("response", response)
            let tx = await response.wait();
            this.utils.stopLoader();
            resolve({
                contract: contractAddress,
                grantee: userPublicKey,
                amount: amount,
                status: "Success"
            });
            // } catch (e) {
            //     this.utils.stopLoader();
            //     reject({
            //         contract: contractAddress,
            //         grantee: userPublicKey,
            //         amount: amount,
            //         status: "Failed"
            //     });
            // }

        })
    }

    withdrawRefund(contractAddress, donorAddress) {
        return new Promise(async (resolve, reject) => {
            try {
                this.utils.startLoader();
                const provider = new ethers.providers.Web3Provider(this.web3Provider);
                const signer = provider.getSigner();
                let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
                let contractWithSigner = contract.connect(signer);
                let response = await contractWithSigner.withdrawRefund(donorAddress)
                console.log("response", response);
                let tx = await response.wait();
                console.log("tx", tx);
                this.utils.stopLoader();
                resolve({
                    contract: contractAddress,
                    donor: donorAddress,
                    status: "Success"
                });
            } catch (e) {
                this.utils.stopLoader();
                reject({
                    contract: contractAddress,
                    donor: donorAddress,
                    status: "Failed"
                });
            }
        })
    }

    signal(contractAddress, support, amount) {
        return new Promise(async (resolve, reject) => {
            // try {
            this.utils.startLoader();
            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
            let contractWithSigner = contract.connect(signer);
            let valuetkn = new ethers.utils.BigNumber(amount);
            let response = await contractWithSigner.signal(support, valuetkn, { gasLimit: AppSettings.ethersConfig.gasLimit });
            console.log("response", response);
            let tx = await response.wait();
            console.log("tx", tx);
            this.utils.stopLoader();
            resolve();
            // } catch (e) {
            //     this.utils.stopLoader();
            //     reject();
            // }
        })
    }

    cancelGrant(contractAddress) {
        return new Promise(async (resolve, reject) => {
            this.utils.startLoader();
            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
            let contractWithSigner = contract.connect(signer);
            contractWithSigner.cancelGrant({ gasLimit: AppSettings.ethersConfig.gasLimit }).then(async (response) => {
                console.log("response", response);
                this.utils.stopLoader();
                resolve({
                    status: "success",
                    message: "Reqest sent successfully",
                    hash: response.hash
                });

            }, (error) => {
                console.log(error)
                this.utils.stopLoader();
                resolve({
                    status: "failed",
                    message: error.message,
                    hash: ''
                });
            });

            // let tx = await response.wait();
        });
    }

    getTransactionStatus(hash) {
        return new Promise((resolve) => {
            console.log("getTransactionStatus")
            setTimeout(async () => {
                let status = await this.getTransactionReceipt(hash);
                console.log(status);
                return status;
            }, 1000)
        });
    }

    getTransactionReceipt(hash) {
        return new Promise((resolve) => {
            console.log("getTransactionReceipt")
            window.web3.eth.getTransactionReceipt(hash, function (error, result) {
                if (error) {
                    console.log("error", error);
                    resolve();
                } else {
                    console.log("result", result);
                    if (!result) {
                        this.getTransactionStatus(hash);
                        resolve();
                    } else {
                        let valuetkn = new ethers.utils.BigNumber(result.status);
                        console.log("valuetkn", valuetkn);
                        resolve(result.status);
                    }
                }
            })
        })

    }
}

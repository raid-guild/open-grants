import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import { ethers, providers, utils } from 'ethers';
import UniLogin from '@unilogin/provider';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AddressZero, Zero } from "ethers/constants";
import { UtilsService } from './utils.service';
import { AppSettings } from '../config/app.config';

declare let require: any;
declare let window: any;

let tokenAbi = require('../../assets/abi/Grant.json');

export interface AcctInfo {
    account: String,
    balance: number
};

@Injectable({
    providedIn: 'root'
})

export class EthcontractService {
    private web3Provider: any = window.web3.currentProvider;
    // private acctInfoSubject = new Subject<AcctInfo>();
    // acctInfo = this.acctInfoSubject.asObservable();

    constructor(
        private toastr: ToastrService,
        private utilsService: UtilsService
    ) { }

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
            //     console.log("account", account);
            //     if (err === null) {
            //         window.web3.eth.getBalance(account, (err, balance) => {
            //             if (err === null) {
            //                 resolve({
            //                     account: account,
            //                     balance: (window.web3.fromWei(balance, "ether")).toNumber()
            //                 });
            //             } else {
            //                 resolve({
            //                     account: 'error',
            //                     balance: 0
            //                 });
            //             }
            //         });
            //     }
            //     resolve({
            //         account: 'error',
            //         balance: 0
            //     });
            // });

            // window.web3.listAccounts().then(account => {
            //     console.log("account", account)
            //     if (account.length) {
            //         window.web3.getBalance(account[0]).then((balance) => {
            //             resolve({
            //                 account: account,
            //                 balance: (window.web3.fromWei(balance, "ether")).toNumber()
            //             });
            //         });
            //     } else {
            //         resolve({
            //             account: 'error',
            //             balance: 0
            //         })
            //     }
            // }).catch(err => {
            //     resolve({
            //         account: 'error',
            //         balance: 0
            //     })
            // });
        });
    }

    async getAvailableAccount() {
        return new Promise(async (resolve, reject) => {
            window.web3.eth.getCoinbase((err, account) => {
                if (err === null) {
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
                } else {
                    resolve({
                        account: 'error',
                        balance: 0
                    });
                }
            });
        });
    }


    async deployContract(data) {
        return new Promise(async (resolve, reject) => {
            this.utilsService.startLoader();

            // let data = {
            //     currency: "wei",
            //     grantees: ['0x6D48912C6c768e0CAd669b0154DD85F156284A21'],
            //     amounts: [10000],
            //     manager: "0x14791697260E4c9A71f18484C9f997B308e59325",
            //     targetFunding: 10000,
            //     fundingExpiration: "1587114701",
            //     contractExpiration: "1589706701"
            // }
            let currency = AddressZero;
            if (data.currency == "ETH") {
                data.amounts = data.amounts.map((amount) => {
                    amount = (ethers.utils.parseEther(amount.toString())).toString();
                    return amount;
                })

                data.targetFunding = (ethers.utils.parseEther(data.targetFunding.toString())).toString();
            }

            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let factory = new ethers.ContractFactory(tokenAbi.abi, tokenAbi.bytecode, signer);

            factory.deploy(data.grantees, data.amounts, data.manager, currency, data.targetFunding,
                data.fundingExpiration, data.contractExpiration, { gasLimit: AppSettings.ethersConfig.gasLimit }).then((response) => {
                    this.utilsService.stopLoader();
                    resolve({
                        status: "success",
                        message: "Request sent successfully",
                        address: response.address,
                        hash: response.deployTransaction.hash
                    });
                }, (error) => {
                    console.log(error)
                    this.utilsService.stopLoader();
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
                response = ethers.utils.formatEther(response);
                resolve(response);
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
                const provider = new ethers.providers.Web3Provider(this.web3Provider);
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
            this.utilsService.startLoader();

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
                    this.utilsService.stopLoader();
                    resolve({
                        status: "success",
                        message: "Reqest sent successfully",
                        hash: response.hash
                    });
                }, (error) => {
                    console.log(error)
                    this.utilsService.stopLoader();
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
                const provider = new ethers.providers.Web3Provider(this.web3Provider);
                let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
                let response = await contract.remainingAllocation(userPublicKey);
                response = ethers.utils.formatEther(response);
                resolve(response);
            } catch (e) {
                reject(0);
            }
        });
    }

    approvePayout(contractAddress, granteePublicKey, amount) {
        return new Promise(async (resolve, reject) => {
            this.utilsService.startLoader();
            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
            let contractWithSigner = contract.connect(signer);
            let valuetkn = new ethers.utils.BigNumber(amount);
            contractWithSigner.approvePayout(valuetkn, granteePublicKey, { gasLimit: AppSettings.ethersConfig.gasLimit }).then((response) => {
                console.log("response", response);
                this.utilsService.stopLoader();
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
                this.utilsService.stopLoader();
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
            this.utilsService.startLoader();
            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
            let contractWithSigner = contract.connect(signer);
            let valuetkn = new ethers.utils.BigNumber(amount);
            let response = await contractWithSigner.approveRefund(valuetkn, userPublicKey, { gasLimit: AppSettings.ethersConfig.gasLimit });
            console.log("response", response)
            let tx = await response.wait();
            this.utilsService.stopLoader();
            resolve({
                contract: contractAddress,
                grantee: userPublicKey,
                amount: amount,
                status: "Success"
            });
            // } catch (e) {
            //     this.utilsService.stopLoader();
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
                this.utilsService.startLoader();
                const provider = new ethers.providers.Web3Provider(this.web3Provider);
                const signer = provider.getSigner();
                let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
                let contractWithSigner = contract.connect(signer);
                let response = await contractWithSigner.withdrawRefund(donorAddress)
                console.log("response", response);
                let tx = await response.wait();
                console.log("tx", tx);
                this.utilsService.stopLoader();
                resolve({
                    contract: contractAddress,
                    donor: donorAddress,
                    status: "Success"
                });
            } catch (e) {
                this.utilsService.stopLoader();
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
            this.utilsService.startLoader();
            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
            let contractWithSigner = contract.connect(signer);
            let valuetkn = new ethers.utils.BigNumber(amount);
            let response = await contractWithSigner.signal(support, valuetkn, { gasLimit: AppSettings.ethersConfig.gasLimit });
            console.log("response", response);
            let tx = await response.wait();
            console.log("tx", tx);
            this.utilsService.stopLoader();
            resolve();
            // } catch (e) {
            //     this.utilsService.stopLoader();
            //     reject();
            // }
        })
    }

    cancelGrant(contractAddress) {
        return new Promise(async (resolve, reject) => {
            this.utilsService.startLoader();
            const provider = new ethers.providers.Web3Provider(this.web3Provider);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(contractAddress, tokenAbi.abi, provider);
            let contractWithSigner = contract.connect(signer);
            contractWithSigner.cancelGrant({ gasLimit: AppSettings.ethersConfig.gasLimit }).then(async (response) => {
                console.log("response", response);
                this.utilsService.stopLoader();
                resolve({
                    status: "success",
                    message: "Reqest sent successfully",
                    hash: response.hash
                });

            }, (error) => {
                console.log(error)
                this.utilsService.stopLoader();
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

import { Injectable } from '@angular/core';
import { ethers, utils, constants } from 'ethers';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from './utils.service';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import { Web3Service } from './web3.service';

declare let require: any;
declare let window: any;

const { AddressZero } = constants;
const GrantFactory = require('../../assets/abi/GrantFactory.json');
const ManagedCappedGrantAbi = require('../../assets/abi/ManagedCappedGrant.json');

export interface AcctInfo {
    account: string;
    balance: number;
}

@Injectable({
    providedIn: 'root'
})
export class EthContractService {

    constructor(
        private toastr: ToastrService,
        private utilsService: UtilsService,
        private web3Service: Web3Service
    ) { }

    createGrant(data) {
        return new Promise(async (resolve, reject) => {
            // data = {
            //     currency: "ETH",
            //     grantees: ['0x6D48912C6c768e0CAd669b0154DD85F156284A21'],
            //     amounts: [10],
            //     manager: "0x14791697260E4c9A71f18484C9f997B308e59325",
            //     targetFunding: 10,
            //     fundingExpiration: "1587114701",
            //     contractExpiration: "1589706701"
            // }

            const currency = AddressZero;
            if (data.currency === 'ETH') {
                data.amounts = data.amounts.map((amount) => {
                    amount = (ethers.utils.parseEther(amount.toString())).toString();
                    return amount;
                });

                data.targetFunding = (ethers.utils.parseEther(data.targetFunding.toString())).toString();
            }

            console.log('data', data);

            await this.web3Service.setProvider();
            const provider = this.web3Service.getProvider();
            const signer = provider.getSigner();
            const contract = new ethers.Contract(environment.ethersConfig.factoryContract, GrantFactory.abi, provider);
            const contractWithSigner = contract.connect(signer);

            contractWithSigner.create(data.grantees, data.amounts, data.manager, currency, data.targetFunding,
                data.fundingExpiration, data.contractExpiration, data.uri, AddressZero, { gasLimit: environment.ethersConfig.gasLimit })
                .then(async (response) => {
                    console.log('Create', response);
                    try {
                        // let temp = await response.wait();
                        resolve({
                            status: 'success',
                            message: 'Grant Created successfully',
                            address: '',
                            hash: response.hash
                        });
                    } catch (e) {
                        resolve({
                            hash: '',
                            address: '',
                            status: 'failed',
                            message: 'Error creating grant',
                        });
                    }
                }, (error) => {
                    console.log(error);
                    resolve({
                        hash: '',
                        address: '',
                        status: 'failed',
                        message: error.message
                    });
                });
        });
    }

    checkAvailableBalance(contractAddress) {
        return new Promise(async (resolve) => {
            try {
                const provider = ethers.getDefaultProvider(environment.ethersConfig.network);
                const contract = new ethers.Contract(contractAddress, ManagedCappedGrantAbi.abi, provider);
                const response = await contract.availableBalance();
                resolve(response);
            } catch (e) {
                resolve(0);
            }
        });
    }

    async isManager(contractAddress, publicKey) {
        return new Promise(async (resolve, reject) => {
            try {
                const provider = ethers.getDefaultProvider(environment.ethersConfig.network);
                const contract = new ethers.Contract(contractAddress, ManagedCappedGrantAbi.abi, provider);
                const response = await contract.isManager(publicKey);
                resolve(response);
            } catch (e) {
                reject(false);
            }
        });
    }

    canFund(contractAddress) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.web3Service.setProvider();
                const provider = this.web3Service.getProvider();
                const contract = new ethers.Contract(contractAddress, ManagedCappedGrantAbi.abi, provider);
                const response = await contract.canFund();
                resolve(response);
            } catch (e) {
                reject(false);
            }
        });
    }

    fund(contractAddress, amount) {
        return new Promise(async (resolve, reject) => {

            await this.web3Service.setProvider();
            const provider = this.web3Service.getProvider();
            const signer = provider.getSigner();
            const valuetkn = ethers.BigNumber.from(amount);

            signer.sendTransaction({
                to: contractAddress,
                value: valuetkn,
                gasLimit: environment.ethersConfig.gasLimit
            })
                .then((response) => {
                    console.log('response', response);
                    resolve({
                        status: 'success',
                        message: 'Reqest sent successfully',
                        hash: response.hash
                    });
                }, (error) => {
                    console.log(error);
                    resolve({
                        hash: '',
                        status: 'failed',
                        message: error.message
                    });
                });
        });
    }

    remainingAllocation(contractAddress, userPublicKey) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.web3Service.setProvider();
                const provider = this.web3Service.getProvider();
                const contract = new ethers.Contract(contractAddress, ManagedCappedGrantAbi.abi, provider);
                const response = await contract.remainingAllocation(userPublicKey);
                resolve(response);
            } catch (e) {
                reject(0);
            }
        });
    }

    approvePayout(contractAddress, granteePublicKey, amount) {
        return new Promise(async (resolve, reject) => {
            this.utilsService.startLoader();
            await this.web3Service.setProvider();
            const provider = this.web3Service.getProvider();
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ManagedCappedGrantAbi.abi, provider);
            const contractWithSigner = contract.connect(signer);
            const valuetkn = ethers.BigNumber.from(amount);
            contractWithSigner
                .approvePayout(valuetkn, granteePublicKey, { gasLimit: environment.ethersConfig.gasLimit })
                .then((response) => {
                    console.log('response', response);
                    this.utilsService.stopLoader();
                    resolve({
                        status: 'success',
                        message: 'Reqest sent successfully',
                        contract: contractAddress,
                        grantee: granteePublicKey,
                        amount,
                        hash: response.hash
                    });
                }, (error) => {
                    console.log(error);
                    this.utilsService.stopLoader();
                    resolve({
                        hash: '',
                        status: 'failed',
                        message: error.message,
                        contract: contractAddress,
                        grantee: granteePublicKey,
                        amount,
                    });
                });
        });
    }

    approveRefund(contractAddress, userPublicKey, amount) {
        return new Promise(async (resolve, reject) => {
            this.utilsService.startLoader();
            await this.web3Service.setProvider();
            const provider = this.web3Service.getProvider();
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ManagedCappedGrantAbi.abi, provider);
            const contractWithSigner = contract.connect(signer);
            const valuetkn = ethers.BigNumber.from(amount);
            const response = await contractWithSigner
                .approveRefund(valuetkn, userPublicKey, { gasLimit: environment.ethersConfig.gasLimit });
            console.log('response', response);
            const tx = await response.wait();
            this.utilsService.stopLoader();
            resolve({
                contract: contractAddress,
                grantee: userPublicKey,
                amount,
                status: 'Success'
            });
        });
    }

    withdrawRefund(contractAddress, donorAddress) {
        return new Promise(async (resolve, reject) => {
            try {
                this.utilsService.startLoader();
                await this.web3Service.setProvider();
                const provider = this.web3Service.getProvider();
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, ManagedCappedGrantAbi.abi, provider);
                const contractWithSigner = contract.connect(signer);
                const response = await contractWithSigner.withdrawRefund(donorAddress);
                console.log('response', response);
                const tx = await response.wait();
                console.log('tx', tx);
                this.utilsService.stopLoader();
                resolve({
                    contract: contractAddress,
                    donor: donorAddress,
                    status: 'Success'
                });
            } catch (e) {
                this.utilsService.stopLoader();
                reject({
                    contract: contractAddress,
                    donor: donorAddress,
                    status: 'Failed'
                });
            }
        });
    }

    cancelGrant(contractAddress) {
        return new Promise(async (resolve, reject) => {
            await this.web3Service.setProvider();
            const provider = this.web3Service.getProvider();
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ManagedCappedGrantAbi.abi, provider);
            const contractWithSigner = contract.connect(signer);
            contractWithSigner.cancelGrant({ gasLimit: environment.ethersConfig.gasLimit }).then(async (response) => {
                resolve({
                    status: 'success',
                    message: 'Reqest sent successfully',
                    hash: response.hash
                });

            }, (error) => {
                resolve({
                    status: 'failed',
                    message: error.message,
                    hash: ''
                });
            });

        });
    }

    getTransactionStatus(hash) {
        return new Promise((resolve) => {
            console.log('getTransactionStatus');
            setTimeout(async () => {
                const status = await this.getTransactionReceipt(hash);
                console.log(status);
                return status;
            }, 1000);
        });
    }

    getTransactionReceipt(hash) {
        return new Promise((resolve) => {
            console.log('getTransactionReceipt');
            window.web3.eth.getTransactionReceipt(hash, function(error, result) {
                if (error) {
                    console.log('error', error);
                    resolve();
                } else {
                    console.log('result', result);
                    if (!result) {
                        this.getTransactionStatus(hash);
                        resolve();
                    } else {
                        const valuetkn = ethers.BigNumber.from(result.status);
                        console.log('valuetkn', valuetkn);
                        resolve(result.status);
                    }
                }
            });
        });

    }

    parseTransaction(input) {
        const iface = new ethers.utils.Interface(GrantFactory.abi);
        const parseData = iface.parseTransaction({ data: input });

        const data = {
            grantees: parseData.args[0],
            amounts: parseData.args[1],
            manager: parseData.args[2],
            currency: parseData.args[3],
            targetFunding: ethers.utils.formatEther(parseData.args[4]),
            fundingDeadline: moment(+parseData.args[5].toString(16).toUpperCase()).format(),
            contractExpiration: moment(+parseData.args[6].toString(16).toUpperCase()).format(),
            uri: parseData.args[7],
        };

        if (data.uri !== AddressZero) {
            data.uri = utils.parseBytes32String(data.uri);
        }

        return data;
    }

}

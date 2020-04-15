// import { Injectable } from '@angular/core';
// import { ACNC_WALLET } from '../config';
// import { CommonService } from './common.service';
// import { environment } from '../../environments/environment.prod';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';

// declare let lightwallet: any;
// declare let Web3: any;
// declare let async: any;
// declare let HookedWeb3Provider: any;

// @Injectable()
// export class WalletService {
//     web3: any;
//     global_keystore: any = '';
//     randomSeed: any = '';
//     addressKey: any = '';
//     password = ACNC_WALLET.password;
//     contractAddress = ACNC_WALLET.contractAddress;
//     baseUrl = environment.api_endpoint;
//     public user = {
//         wallet_address: '',
//         ethBalance: 0,
//         nonce: 0,
//         tokenBalance: 0
//     };

//     constructor(private commonService: CommonService,
//         private http: HttpClient) {
//         this.web3 = new Web3();
//     }

//     setWeb3Provider(keystore) {
//         const web3Provider = new HookedWeb3Provider({
//             host: 'https://mainnet.infura.io/',
//             transaction_signer: keystore
//         });
//         this.web3.setProvider(web3Provider);
//     } // web3Provider (for setting)

//     generateWalletData() {
//         return new Promise(((resolve, reject) => {
//             const extraEntropy = ''; // Type random text to generate entropy
//             const randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
//             this.randomSeed = randomSeed;

//             lightwallet.keystore.createVault({
//                 password: this.password,
//                 seedPhrase: randomSeed,
//                 hdPathString: 'm/0\'/0\'/0\''
//             }, async (err, ks) => {
//                 if (err) {
//                     resolve({ err: err, status: false });
//                 }
//                 this.global_keystore = ks;
//                 this.setWeb3Provider(this.global_keystore);
//                 const wallet_address = await this.createOrRetriveAddresses(this.password);
//                 resolve({
//                     status: true,
//                     wallet_seed: this.randomSeed,
//                     wallet_address: wallet_address[0]
//                 });
//             });
//         }));
//     } // To Generate Wallet seed and address

//     getEthBalance() {
//         this.web3.eth.getBalance(this.user.wallet_address, (err, result) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 this.user.ethBalance = result / 1.0e18;
//                 return result / 1.0e18;
//             }
//         });

//     }

//     getNonceValue() {
//         const currentBlock = this.web3.eth.blockNumber;
//         this.user.nonce = this.web3.eth.getTransactionCount(this.user.wallet_address, currentBlock);
//         return this.user.nonce;
//     }

//     setSeed(seed) {
//         return new Promise(((resolve, reject) => {
//             lightwallet.keystore.createVault({
//                 password: this.password,
//                 seedPhrase: seed,
//                 hdPathString: 'm/0\'/0\'/0\''
//             }, async (err, ks) => {
//                 this.global_keystore = ks;
//                 const addresses = await this.createOrRetriveAddresses(this.password);
//                 this.setWeb3Provider(this.global_keystore);
//                 this.user.wallet_address = addresses[0];
//                 this.getNonceValue();
//                 this.getEthBalance();
//                 resolve(addresses[0]);
//             });
//         }));
//     }

//     tokenbal() {
//         const wallet_address = this.user.wallet_address;
//         return new Promise((resolve, reject) => {
//             const abi = JSON.parse('[{"constant":true,"inputs":[],"name":"AddrDevelopFunds","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"AddrDevelopGroup","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"AddrInvestor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"AddrRewardPlan","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"AddrMarketing","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"AddrPartnerPocket","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"AddrCommunityDistribute","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"}],"name":"destroyAndSend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]');
//             const contract = this.web3.eth.contract(abi).at(this.contractAddress);
//             contract.balanceOf(wallet_address, (err, tokenbalance) => {
//                 if (!err) {
//                     const tokenBal: any = parseFloat((tokenbalance).toFixed(18)) / 1.0e18;
//                     this.user.tokenBalance = tokenBal;
//                     resolve(tokenBal);
//                 } else {
//                     console.log('err', err);
//                     resolve(0);
//                 }
//             });
//         });
//     }

//     paymentStatusUpdate(orderId, payload) {
//         return this.http.post(this.baseUrl + 'payment-status-update/' + orderId, payload, this.commonService.getOptions());
//     }

//     transfer(sender, receiver, amount) {
//         return new Promise((async (resolve, reject) => {
//             try {
//                 const fromAddr = sender; // Dynamic
//                 const toAddr = receiver; // Dynamic
//                 const contractAddr = ACNC_WALLET.contractAddress; // await this.setSeed(sender);
//                 const abi = JSON.parse('[{"constant":true,"inputs":[],"name":"AddrDevelopFunds","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"AddrDevelopGroup","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"AddrInvestor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"AddrRewardPlan","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"AddrMarketing","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"AddrPartnerPocket","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"AddrCommunityDistribute","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"}],"name":"destroyAndSend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]');
//                 const contract = this.web3.eth.contract(abi).at(contractAddr);
//                 const functionName = 'transfer';
//                 let valuetkn = amount; // Dynamic
//                 valuetkn = parseFloat(valuetkn) * 1.0e18;
//                 const code = contract.transfer.getData(toAddr, valuetkn);
//                 const gasPrice = 30000000000;  // Dynamic not for now
//                 const gas = 90000;
//                 this.getNonceValue();
//                 const txOptions = {
//                     gasPrice: gasPrice,
//                     gasLimit: gas,
//                     nonce: this.user.nonce,
//                     data: code,
//                     to: ''
//                 };
//                 txOptions.to = contractAddr;
//                 const functionCallTx = lightwallet.txutils.functionTx(abi, 'transfer', [toAddr, valuetkn], txOptions);
//                 this.global_keystore.keyFromPassword(this.password, (err, pwDerivedKey) => {
//                     const signedFunctionTx = lightwallet.signing.signTx(this.global_keystore, pwDerivedKey, functionCallTx, fromAddr);
//                     this.web3.eth.sendRawTransaction('0x' + signedFunctionTx, (errRawTxn, hash) => {
//                         console.log('err, hash', errRawTxn, hash, sender, receiver, amount);
//                         if (errRawTxn) {
//                             reject({
//                                 status: false,
//                                 message: 'Transfer Error',
//                                 err: errRawTxn
//                             });
//                         } else {
//                             resolve({
//                                 status: true,
//                                 hash: hash
//                             });
//                         }
//                     });
//                 });
//             } catch (e) {
//                 reject({
//                     status: false,
//                     message: 'Transfer Error',
//                     catched: 'catched',
//                     err: e
//                 });
//             }
//         }));
//     }

//     transferAndConfirmPayment(sender, receiver, amount) {
//         let receiptCheckerInterval;
//         let hash = 'FAILED';
//         let transferRes: any;
//         return new Promise((async (resolve, reject) => {
//             const checkRes = (res: any) => {
//                 console.log('transferAndConfirmPayment res', res)
//                 if (!(res.statusCode === 0 && res.status === 'failure')) {
//                     resolve({ status: true, hash: hash });
//                 }

//                 // if (res.statusCode == 1 && res.status == 'success') {
//                 //     clearInterval(receiptCheckerInterval);
//                 //     console.log('txn success', hash);
//                 //     resolve({status: true, hash: hash});
//                 // } else if (res.statusCode == 0 && res.status == 'failure') {
//                 //     clearInterval(receiptCheckerInterval);
//                 //     console.log('txn failed', hash);
//                 //     resolve({status: false, hash: hash});
//                 // }
//             };

//             let statusRes = null;
//             try {
//                 console.log(sender, receiver, amount, 'start Transfer');
//                 transferRes = await this.transfer(sender, receiver, amount);
//             } catch (e) {
//                 console.log('txn failed', hash);
//                 resolve({ status: false, hash: hash });
//             }
//             if (transferRes && transferRes.status == true) {
//                 try {
//                     hash = transferRes.hash;
//                     console.log(hash);
//                     statusRes = await this.getTransactionStatus(transferRes.hash);
//                     console.log('statusRes', statusRes);
//                     checkRes(statusRes);
//                 } catch (e) {
//                     console.log('e', e);
//                     if (e.hasOwnProperty('statusCode') && e.hasOwnProperty('status')) {
//                         console.log('e', e);
//                         checkRes(e);
//                     }
//                 }

//                 // receiptCheckerInterval = setInterval(async (res) => {
//                 //     try {
//                 //         statusRes = await this.getTransactionStatus(transferRes.hash);
//                 //         checkRes(statusRes);
//                 //     } catch (e) {
//                 //     }
//                 // }, 2000);
//             } else {
//                 resolve(transferRes);
//             }
//         }
//         ));
//     }

//     bulkTransferObservable(transferDetailsBulk = []) {
//         return Observable.create(async (observer) => {
//             const bulkLength = transferDetailsBulk.length;
//             let count = bulkLength;
//             const successfulTransfers = [];
//             const failureTransfers = [];

//             const isComplete = (txnRes) => {
//                 observer.next(txnRes);
//                 if (count == 0) {
//                     observer.complete();
//                 }
//             };

//             for (let i = 0; i < transferDetailsBulk.length; i++) {
//                 try {
//                     const res: any = await this.transferAndConfirmPayment(transferDetailsBulk[i].sender, transferDetailsBulk[i].receiver, transferDetailsBulk[i].amount);
//                     transferDetailsBulk[i]['hash'] = res.hash;
//                     transferDetailsBulk[i]['hash'] = res.hash;
//                     transferDetailsBulk[i]['status'] = true;
//                     count -= 1;
//                     console.log('transfer configrm res', res);
//                     if (res && res.status) {
//                         successfulTransfers.push(transferDetailsBulk[i]);
//                         isComplete(transferDetailsBulk[i]);
//                     } else if (res && res.status == false) {
//                         transferDetailsBulk[i]['err'] = res.err;
//                         transferDetailsBulk[i]['status'] = false;
//                         failureTransfers.push(transferDetailsBulk[i]);
//                         isComplete(transferDetailsBulk[i]);
//                     }
//                 } catch (e) {
//                     console.log('rejected', e);
//                     transferDetailsBulk[i]['hash'] = e.hash;
//                     transferDetailsBulk[i]['status'] = false;
//                     count -= 1;
//                     isComplete(transferDetailsBulk[i]);
//                     Observable.throw(e);
//                 }
//             }
//             /*
//                         transferDetailsBulk.forEach(async (transferDetail: any) => {
//                             console.log('forDATA', transferDetail);
//                         });*/
//         });
//     }

//     getTransactionStatus(transactionId) {
//         return new Promise((resolve, reject) => {
//             const receipt = this.web3.eth.getTransactionReceipt(transactionId);
//             console.log('receipt', receipt);
//             if (receipt && !receipt.status) {
//                 resolve({ statusCode: null, status: 'pending' });
//             } else if (receipt && receipt.status == '0x0') {
//                 resolve({ statusCode: 0, status: 'failure' });
//             } else if (receipt && receipt.status == '0x1') {
//                 resolve({ statusCode: 1, status: 'success' });
//             } else {
//                 resolve({ statusCode: 1, status: 'success' });
//                 // @todo Check whole code transaction
//                 // reject({statusCode: undefined, status: 'undefined'});
//             }
//         });
//     }

//     createOrRetriveAddresses(password) {
//         return new Promise(async (resolve, reject) => {
//             let addresses = [];
//             if (password == '') {
//                 password = ')(*&^%$#@!';
//             }
//             const numAddr = 1;
//             await this.global_keystore.keyFromPassword(password, async (err, pwDerivedKey) => {
//                 await this.global_keystore.generateNewAddress(pwDerivedKey, numAddr);
//                 addresses = await this.global_keystore.getAddresses();
//                 resolve(addresses);
//             });
//         });
//     }

//     getUSDtoCNY() {
//         return this.http.get(this.baseUrl + 'USD-to-CNY', this.commonService.getOptions());
//     }

//     getWalletDepositWithdrawList() {
//         return this.http.get(this.baseUrl + 'deposit-withdraw-list', this.commonService.getOptions());
//     }

//     walletRequest(data) {
//         return this.http.post(this.baseUrl + 'deposit-withdraw-save', data, this.commonService.getOptions());
//     }

//     withdrawProcessCompleted(id, data) {
//         return this.http.post(this.baseUrl + `withdraw/${id}/completed`, data, this.commonService.getOptions());
//     }
// }

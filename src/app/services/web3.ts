import { Injectable, InjectionToken } from '@angular/core';
import Web3 from 'web3';

declare let window: any;

@Injectable({
    providedIn: 'root'
})

export class WEB3 {
    provider: any;
    constructor() {
        if (window.ethereum) {
            this.provider = window.ethereum;
            window.web3 = new Web3(window.ethereum)
            // await window.ethereum.enable()
        }
        else if (window.web3) {
            this.provider = window.web3.currentProvider;
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
            // this.web3Provider = new Web3.providers.HttpProvider(AppSettings.ethersConfig.rpcURL);
            // this.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
        }

        // window.ethereum.on('accountsChanged', (accounts) => {
        //     console.log("accountsChanged");
        // });

        // window.ethereum.on('networkChanged', (network) => {
        //     console.log("networkChanged");
        // });
    }
}




// export const WEB3 = new InjectionToken<any>('web3', {
//     providedIn: 'root',
//     factory: () => {
//         try {
//             let provider: any;
//             if (window.ethereum) {
//                 provider = window.ethereum;
//                 window.web3 = new Web3(window.ethereum)
//             }
//             else if (window.web3) {
//                 provider = window.web3.currentProvider;
//                 window.web3 = new Web3(window.web3.currentProvider)
//             }
//             else {
//                 throw new Error('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!');
//             }
//             // const provider = ('ethereum' in window) ? window['ethereum'] : Web3.givenProvider;
//             return new Web3(provider);
//         } catch (err) {
//             throw new Error('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!');
//         }
//     }
// });
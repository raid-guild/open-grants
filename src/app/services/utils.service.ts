import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { AppSettings } from '../config/app.config';
import { ethers, providers, utils } from 'ethers';
import * as moment from 'moment';
import { AddressZero } from 'ethers/constants';

export interface ILoader {
    loading: boolean;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    private loaderSubscription = new Subject<ILoader>();
    onLoaderChange = this.loaderSubscription.asObservable();

    private loadersCount = 0;

    constructor(
        private angularFireStorage: AngularFireStorage,
    ) { }


    startLoader(message: string = '') {
        if (!this.loadersCount) {
            this.loaderSubscription.next({ loading: true, message });
        }
        this.loadersCount += 1;
    }

    stopLoader() {
        if (this.loadersCount) {
            this.loadersCount -= 1;
        }

        if (!this.loadersCount) {
            this.loaderSubscription.next({ loading: false, message: '' });
        }
    }

    fileToBase64(file: File): Promise<{ status: boolean, data?: any, error?: any }> {
        return new Promise((resolve => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve({
                    status: true,
                    data: reader.result
                });
            };
            reader.onerror = function (error) {
                resolve({
                    status: false,
                    data: null,
                    error: error
                });
            };
        }));
    }

    dataURLtoFile(dataurl, filename) {
        if (dataurl) {
            let arr = dataurl.split(',');
            console.log('arr', arr);
            let mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            console.log('mime', mime);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename || 'temp', { type: mime });
        } else {
            return false;
        }
    }

    fileUpload(file: File, folderName: string) {
        return new Promise((resolve) => {
            if (file) {
                const fileName = `${new Date().getTime()}_${file.name}`;
                const path = folderName + '/' + fileName;

                this.angularFireStorage.upload(path, file).then((snapshot) => {
                    if (snapshot.state = "success") {
                        let downloadURL = 'https://firebasestorage.googleapis.com/v0/b/' + AppSettings.firebaseConfig.storageBucket + '/o/' + folderName + '%2F' + fileName + '?alt=media';

                        resolve(downloadURL);
                    } else {
                        resolve();
                    }
                }).catch((error) => {
                    console.error(error);
                    resolve();
                });
            } else {
                resolve();
            }
        })
    }

    base64ImageUpload(base64: string, folderName: string) {
        return new Promise((resolve) => {
            var file = this.dataURLtoFile(base64, 'content.jpeg');

            if (file) {
                const fileName = `${new Date().getTime()}_${file.name}`;
                const path = folderName + '/' + fileName;

                this.angularFireStorage.upload(path, file).then((snapshot) => {
                    if (snapshot.state = "success") {
                        let downloadURL = 'https://firebasestorage.googleapis.com/v0/b/' + AppSettings.firebaseConfig.storageBucket + '/o/' + folderName + '%2F' + fileName + '?alt=media';

                        resolve(downloadURL);
                    } else {
                        resolve();
                    }
                }).catch((error) => {
                    console.error(error);
                    resolve();
                });
            } else {
                resolve();
            }
        })
    }

    getFormControlValues(form: FormGroup, controlName: string) {
        const control = form.controls[controlName];
        if (control) {
            return control.value;
        } else {
            return undefined;
        }
    }

    parseTransaction(input) {
        const ABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "name": "id", "type": "uint256" }, { "indexed": false, "name": "grant", "type": "address" }], "name": "LogNewGrant", "type": "event" }, { "constant": false, "inputs": [{ "name": "_grantees", "type": "address[]" }, { "name": "_amounts", "type": "uint256[]" }, { "name": "_manager", "type": "address" }, { "name": "_currency", "type": "address" }, { "name": "_targetFunding", "type": "uint256" }, { "name": "_fundingDeadline", "type": "uint256" }, { "name": "_contractExpiration", "type": "uint256" }, { "name": "_extraData", "type": "bytes" }], "name": "create", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
        const iface = new ethers.utils.Interface(ABI);
        let parseData = iface.parseTransaction({ data: input })

        let data = {
            grantees: parseData.args[0],
            amounts: parseData.args[1],
            manager: parseData.args[2],
            currency: parseData.args[3],
            targetFunding: ethers.utils.formatEther(parseData.args[4]),
            fundingDeadline: moment(+parseData.args[5].toString(16).toUpperCase()).format(),
            contractExpiration: moment(+parseData.args[6].toString(16).toUpperCase()).format(),
            uri: parseData.args[7],
        }

        if (data.uri != AddressZero) {
            data.uri = utils.parseBytes32String(data.uri);
        }

        return data;
    }

    generateUUID(length: number = 16, options?: { numericOnly: boolean }) {
        let text = '';
        const possible =
            options && options.numericOnly ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }
}  
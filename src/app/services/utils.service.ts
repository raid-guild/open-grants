import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

import { AppSettings } from '../config/app.config';

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
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve({
                    status: true,
                    data: reader.result
                });
            };
            reader.onerror = (error) => {
                resolve({
                    status: false,
                    data: null,
                    error
                });
            };
        }));
    }

    dataURLtoFile(dataurl, filename) {
        if (dataurl) {
            const arr = dataurl.split(',');
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

                // this.angularFireStorage.upload(path, file).then((snapshot) => {
                //     if (snapshot.state == 'success') {
                //         const downloadURL = 'https://firebasestorage.googleapis.com/v0/b/' + AppSettings.firebaseConfig.storageBucket + '/o/' + folderName + '%2F' + fileName + '?alt=media';

                //         resolve(downloadURL);
                //     } else {
                //         resolve();
                //     }
                // }).catch((error) => {
                //     console.error(error);
                //     resolve();
                // });
            } else {
                resolve();
            }
        });
    }

    base64ImageUpload(base64: string, folderName: string) {
        return new Promise((resolve) => {
            let file = this.dataURLtoFile(base64, 'content.jpeg');

            if (file) {
                const fileName = `${new Date().getTime()}_${file.name}`;
                const path = folderName + '/' + fileName;

                // this.angularFireStorage.upload(path, file).then((snapshot) => {
                //     if (snapshot.state = 'success') {
                //         const downloadURL = 'https://firebasestorage.googleapis.com/v0/b/' + AppSettings.firebaseConfig.storageBucket + '/o/' + folderName + '%2F' + fileName + '?alt=media';

                //         resolve(downloadURL);
                //     } else {
                //         resolve();
                //     }
                // }).catch((error) => {
                //     console.error(error);
                //     resolve();
                // });
            } else {
                resolve();
            }
        });
    }

    getFormControlValues(form: FormGroup, controlName: string) {
        const control = form.controls[controlName];
        if (control) {
            return control.value;
        } else {
            return undefined;
        }
    }

}
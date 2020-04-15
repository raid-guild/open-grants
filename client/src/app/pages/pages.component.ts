import { Component, OnInit, NgZone } from '@angular/core';
import { Events } from '@ionic/angular';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CreateNewGrantComponent } from './create-new-grant/create-new-grant.component';
import { ethers } from 'ethers';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HTTPRESPONSE } from '../common/http-helper/http-helper.class';
import { async } from '@angular/core/testing';
import { PublicKeyModelComponent } from './public-key-model/public-key-model.component';


@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
})

export class PagesComponent implements OnInit {
    public appPages = [
        {
            title: 'Create New Grants',
            url: '/pages/create-new-grant',
            icon: 'gp-grant'
        },
        {
            title: 'My Grants',
            url: '/pages/my-grants',
            icon: 'gp-grant'
        },
        {
            title: 'Latest Grants',
            url: '/pages/latest-grants',
            icon: 'gp-latest-grant'
        }, {
            title: 'Trending Grants',
            url: '/pages/trending-grants',
            icon: 'gp-trending-grants'
        },
        {
            title: 'Transaction History',
            url: '/pages/transaction-history',
            icon: 'gp-transaction-history'
        }
    ];

    userData: any;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private modalController: ModalController,
        public events: Events,
        public router: Router,
        private userService: UserService,
        private _zone: NgZone
    ) {

        (async () => {
            let res: any = await this.userService.getUser().toPromise();
            this.userData = res.data;
            this.publicKeyModal();
        })();

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
    }

    async publicKeyModal() {
        setTimeout(async () => {
            if (this.userData && (!this.userData.hasOwnProperty('publicKey') || !this.userData.publicKey)) {
                this._zone.run(async () => {
                    const modal = await this.modalController.create({
                        component: PublicKeyModelComponent,
                        cssClass: 'custom-modal-style',
                        backdropDismiss: false,
                        mode: "ios"
                    });
                    return await modal.present();
                })
            }
        }, 2000);
    }


    // async createNewGrant() {
    //     console.log("New Grant")
    //     const modal = await this.modalController.create({
    //         component: CreateNewGrantComponent,
    //         cssClass: 'custom-modal-style',
    //         mode: "ios"
    //     })

    //     modal.onDidDismiss()
    //         .then((data) => {
    //             const reload = data['data'];
    //             // console.log("reload", reload);
    //             if (reload && reload.hasOwnProperty('reload') && reload.reload) {
    //                 this.events.publish('my-grants', true);
    //             }
    //         });

    //     return await modal.present();

    // this.router.navigate(['pages/create-new-grant']);
    // }
}

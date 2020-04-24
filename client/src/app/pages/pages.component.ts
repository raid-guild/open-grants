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
        // {
        //     title: 'Transaction History',
        //     url: '/pages/transaction-history',
        //     icon: 'gp-transaction-history'
        // }
    ];

    userData: any;

    constructor(
    ) { }

    ngOnInit() {
    }
}

import { Component, OnInit, NgZone } from '@angular/core';
import { Events } from '@ionic/angular';
import { AuthService, AuthState } from '../services/auth.service';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
    isLogin = false;
    public appPages = [];
    public pages = [
        // {
        //   title: 'Create New Grants',
        //   url: '/pages/create',
        //   icon: 'gp-grant'
        // },
        // {
        //     title: 'Dashboard',
        //     url: '/pages/dashboard',
        //     icon: 'gp-grant'
        // },
        {
            title: 'Latest Grants',
            url: '/pages/latest',
            icon: 'gp-latest-grant'
        }, {
            title: 'Trending Grants',
            url: '/pages/trending',
            icon: 'gp-trending-grants'
        },
        // {
        //     title: 'Transaction History',
        //     url: '/pages/transaction-history',
        //     icon: 'gp-transaction-history'
        // }
    ];

    public allPage = [
        // {
        //     title: 'Dashboard',
        //     url: '/pages/dashboard',
        //     icon: 'gp-grant'
        // },
        {
            title: 'Latest Grants',
            url: '/pages/latest',
            icon: 'gp-latest-grant'
        }, {
            title: 'Trending Grants',
            url: '/pages/trending',
            icon: 'gp-trending-grants'
        },
        {
            title: 'My Grants',
            url: '/pages/my-grants',
            icon: 'gp-grant'
        },
        {
            title: 'User Profile',
            url: '/pages/profile',
            icon: 'gp-user'
        },
    ]

    constructor(
        private authService: AuthService,
        public events: Events
    ) {
        let res = this.authService.getAuthState();
        this.isLogin = res.is_logged_in;

        this.events.subscribe('is_logged_in', (data) => {
            this.isLogin = data;
            if (this.isLogin) {
                this.appPages = this.allPage;
            } else {
                this.appPages = this.pages;
            }
        });

        if (this.isLogin) {
            this.appPages = this.allPage;
        } else {
            this.appPages = this.pages;
        }
    }

    ngOnInit() {
        this.authService.authState.subscribe((res: AuthState) => {
            // console.log("res.is_logged_in", res)
        });
    }
}

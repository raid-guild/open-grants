import { Component, OnInit } from '@angular/core';

import { Platform, ModalController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxSpinnerService } from "ngx-spinner";
import { UtilsService, ILoader } from './services/utils.service';
import { AuthService, AuthState } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  isLogin = false;
  public appPages = [];
  public pages = [
    // {
    //   title: 'Create New Grants',
    //   url: '/pages/create',
    //   icon: 'gp-grant'
    // },
    {
      title: 'Dashboard',
      url: '/pages/dashboard',
      icon: 'gp-grant'
    },
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
    {
      title: 'Dashboard',
      url: '/pages/dashboard',
      icon: 'gp-grant'
    },
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
      title: 'My Profile',
      url: '/pages/profile',
      icon: 'gp-grant'
    },
  ]

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private utilService: UtilsService,
    private modalController: ModalController,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    public events: Events,
  ) {
    this.initializeApp();

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


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
    this.subscriptions();

    this.authService.authState.subscribe((res: AuthState) => {
      console.log("res.is_logged_in", res)
    });
  }

  subscriptions() {
    this.utilService.onLoaderChange.subscribe((data: ILoader) => {
      // console.log("spinner");
      if (data.loading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }
}

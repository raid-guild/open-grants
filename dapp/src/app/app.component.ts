import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxSpinnerService } from "ngx-spinner";
import { UtilsService, ILoader } from './services/utils.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  isLogin = false;
  public appPages = [];
  public pages = [
    {
      title: 'Create New Grants',
      url: '/pages/create',
      icon: 'gp-grant'
    },
    {
      title: 'Dashboard',
      url: '/pages/dashboard',
      icon: 'gp-grant'
    },
    {
      title: 'Latest Grants',
      url: '/pages/latest',
      icon: 'gp-latest-grant'
    },
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
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private utilService: UtilsService,
    private modalController: ModalController,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
  ) {

    var Buffer: any = window['Buffer']
    window['Buffer'] = Buffer["Buffer"]

    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.subscriptions();
  }

  subscriptions() {
    this.utilService.onLoaderChange.subscribe((data: ILoader) => {
      if (data.loading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxSpinnerService } from "ngx-spinner";
import { UtilsService, ILoader } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private utilService: UtilsService,
    private modalController: ModalController,
    private spinner: NgxSpinnerService
  ) {
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
      // console.log("spinner");
      if (data.loading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }
}
